
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
  signup: (email: string, password: string, name: string) => Promise<{success: boolean, errorMessage?: string}>;
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
  signup: async () => ({success: false}),
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
        console.log('Initializing auth from Supabase...');
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user: supabaseUser } = session;
          
          if (supabaseUser) {
            console.log('User found in session:', supabaseUser.id);
            // Get user's profile from 'profiles' table
            let userName = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '';
            
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();
              
              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
              }
              
              if (profile) {
                userName = profile.name || userName;
              } else {
                // Create a profile if it doesn't exist
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: supabaseUser.id,
                    name: userName,
                    email: supabaseUser.email,
                  });
                
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                }
              }
            } catch (error) {
              console.error('Error in profile check:', error);
            }
            
            setIsAuthenticated(true);
            setUser({
              id: supabaseUser.id,
              name: userName,
              email: supabaseUser.email || '',
            });
            
            // Get user's score from 'scores' table
            try {
              const { data: scoreData, error: scoreError } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', supabaseUser.id)
                .single();
              
              if (scoreError && scoreError.code !== 'PGRST116') {
                console.error('Error fetching score:', scoreError);
              }
              
              if (scoreData) {
                setUserScore({
                  score: scoreData.score,
                  level: scoreData.level,
                  masterKey: scoreData.master_key,
                  orderHistory: typeof scoreData.order_history === 'string' 
                    ? JSON.parse(scoreData.order_history) 
                    : scoreData.order_history,
                  platforms: typeof scoreData.platforms === 'string' 
                    ? JSON.parse(scoreData.platforms) 
                    : scoreData.platforms,
                  badges: [],
                  achievements: [],
                  lastUpdated: new Date().toISOString()
                });
              } else {
                // Generate a new score if none exists
                const newScore = generateRandomScore();
                const newMasterKey = createNewMasterKey();
                newScore.masterKey = newMasterKey;
                
                // Insert new score into database
                const { error: insertScoreError } = await supabase.from('scores').insert({
                  user_id: supabaseUser.id,
                  score: newScore.score,
                  level: newScore.level,
                  master_key: newMasterKey,
                  order_history: JSON.stringify(newScore.orderHistory),
                  platforms: JSON.stringify(newScore.platforms),
                });
                
                if (insertScoreError) {
                  console.error('Error creating score:', insertScoreError);
                } else {
                  setUserScore(newScore);
                }
              }
            } catch (error) {
              console.error('Error in score check:', error);
            }
          }
        } else {
          console.log('No active session found');
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
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' && session) {
          const { user: supabaseUser } = session;
          
          if (supabaseUser) {
            console.log('User signed in:', supabaseUser.id);
            // Get user's name from metadata or email
            let userName = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '';
            
            // Check if profile exists
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile on sign in:', profileError);
            }
            
            if (profile) {
              userName = profile.name || userName;
            } else {
              // Create a profile if it doesn't exist
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: supabaseUser.id,
                  name: userName,
                  email: supabaseUser.email,
                });
              
              if (insertError) {
                console.error('Error creating profile on sign in:', insertError);
              }
            }
            
            setIsAuthenticated(true);
            setUser({
              id: supabaseUser.id,
              name: userName,
              email: supabaseUser.email || '',
            });
            
            // Get user's score
            const { data: scoreData, error: scoreError } = await supabase
              .from('scores')
              .select('*')
              .eq('user_id', supabaseUser.id)
              .single();
            
            if (scoreError && scoreError.code !== 'PGRST116') {
              console.error('Error fetching score on sign in:', scoreError);
            }
            
            if (scoreData) {
              setUserScore({
                score: scoreData.score,
                level: scoreData.level,
                masterKey: scoreData.master_key,
                orderHistory: typeof scoreData.order_history === 'string' 
                  ? JSON.parse(scoreData.order_history) 
                  : scoreData.order_history,
                platforms: typeof scoreData.platforms === 'string' 
                  ? JSON.parse(scoreData.platforms) 
                  : scoreData.platforms,
                badges: [],
                achievements: [],
                lastUpdated: new Date().toISOString()
              });
            } else {
              // Generate new score if none exists
              const newScore = generateRandomScore();
              const newMasterKey = createNewMasterKey();
              newScore.masterKey = newMasterKey;
              
              // Insert new score
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
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
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
  const signup = async (email: string, password: string, name: string): Promise<{success: boolean, errorMessage?: string}> => {
    try {
      console.log('Signup attempt:', { email, name });
      
      // Attempt to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name,
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', error);
        return { 
          success: false, 
          errorMessage: error.message || 'Failed to create account. Network error or server unavailable.'
        };
      }
      
      if (!data.user) {
        return { success: false, errorMessage: 'Signup successful but no user returned' };
      }
      
      // Create user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
      });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { 
          success: false, 
          errorMessage: 'Account created but profile setup failed. Please try logging in.'
        };
      }
      
      // Generate a new score with master key
      const newScore = generateRandomScore();
      const newMasterKey = createNewMasterKey();
      newScore.masterKey = newMasterKey;
      
      // Insert score into database
      const { error: scoreError } = await supabase.from('scores').insert({
        user_id: data.user.id,
        score: newScore.score,
        level: newScore.level,
        master_key: newMasterKey,
        order_history: JSON.stringify(newScore.orderHistory),
        platforms: JSON.stringify(newScore.platforms),
      });
      
      if (scoreError) {
        console.error('Error creating score:', scoreError);
        return { 
          success: false, 
          errorMessage: 'Account created but score setup failed. Please try logging in.'
        };
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error during signup:', err);
      return { 
        success: false, 
        errorMessage: 'Network error or server unavailable. Please try again later.'
      };
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt:', { email });
      
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
