
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserScore, generateRandomScore, createNewMasterKey } from '@/utils/trustScore';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Define Auth Context types
interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userScore: UserScore | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserScore: (newScore: UserScore) => Promise<void>;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userScore: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateUserScore: async () => {},
  isLoading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize from Supabase on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user: supabaseUser } = session;
          
          if (supabaseUser) {
            // Get user's profile from 'profiles' table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
            
            setIsAuthenticated(true);
            setUser({
              id: supabaseUser.id,
              name: profile?.name || supabaseUser.email?.split('@')[0] || '',
              email: supabaseUser.email || '',
            });
            
            // Get user's score from 'scores' table
            const { data: scoreData } = await supabase
              .from('scores')
              .select('*')
              .eq('user_id', supabaseUser.id)
              .single();
            
            if (scoreData) {
              setUserScore({
                score: scoreData.score,
                level: scoreData.level,
                masterKey: scoreData.master_key,
                orderHistory: JSON.parse(scoreData.order_history),
                platforms: JSON.parse(scoreData.platforms),
              });
            } else {
              // Generate a new score if none exists
              const newScore = generateRandomScore();
              const newMasterKey = createNewMasterKey();
              newScore.masterKey = newMasterKey;
              
              // Insert new score into database
              await supabase.from('scores').insert({
                user_id: supabaseUser.id,
                score: newScore.score,
                level: newScore.level,
                master_key: newMasterKey,
                order_history: JSON.stringify(newScore.orderHistory),
                platforms: JSON.stringify(newScore.platforms),
              });
              
              setUserScore(newScore);
            }
          }
        }
        
        // Mark loading as complete
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    // Setup auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user: supabaseUser } = session;
          
          if (supabaseUser) {
            // Get user's profile from 'profiles' table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
            
            setIsAuthenticated(true);
            setUser({
              id: supabaseUser.id,
              name: profile?.name || supabaseUser.email?.split('@')[0] || '',
              email: supabaseUser.email || '',
            });
            
            // Get user's score
            const { data: scoreData } = await supabase
              .from('scores')
              .select('*')
              .eq('user_id', supabaseUser.id)
              .single();
            
            if (scoreData) {
              setUserScore({
                score: scoreData.score,
                level: scoreData.level,
                masterKey: scoreData.master_key,
                orderHistory: JSON.parse(scoreData.order_history),
                platforms: JSON.parse(scoreData.platforms),
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          setUserScore(null);
        }
      }
    );

    initializeAuth();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Signup error:', error);
        return false;
      }
      
      if (data.user) {
        // Create user profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
        });
        
        // Generate a new score with master key
        const newScore = generateRandomScore();
        const newMasterKey = createNewMasterKey();
        newScore.masterKey = newMasterKey;
        
        // Insert score into database
        await supabase.from('scores').insert({
          user_id: data.user.id,
          score: newScore.score,
          level: newScore.level,
          master_key: newMasterKey,
          order_history: JSON.stringify(newScore.orderHistory),
          platforms: JSON.stringify(newScore.platforms),
        });
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error during signup:', err);
      return false;
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      return data.session !== null;
    } catch (err) {
      console.error('Error during login:', err);
      return false;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setUserScore(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Update user score
  const updateUserScore = async (newScore: UserScore) => {
    if (!user) return;
    
    try {
      await supabase.from('scores').upsert({
        user_id: user.id,
        score: newScore.score,
        level: newScore.level,
        master_key: newScore.masterKey,
        order_history: JSON.stringify(newScore.orderHistory),
        platforms: JSON.stringify(newScore.platforms),
      });
      
      setUserScore(newScore);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };
  
  // Context provider value
  const value = {
    isAuthenticated,
    user,
    userScore,
    login,
    signup,
    logout,
    updateUserScore,
    isLoading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
