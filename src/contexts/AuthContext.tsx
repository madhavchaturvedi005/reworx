
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserScore, generateRandomScore } from '@/utils/trustScore';

// Define Auth Context types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userScore: UserScore | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserScore: (newScore: UserScore) => void;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userScore: null,
  login: async () => false,
  logout: () => {},
  updateUserScore: () => {},
  isLoading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Add a small delay to ensure localStorage is accessible
        // This helps with certain deployment environments
        setTimeout(() => {
          const storedAuth = localStorage.getItem('auth');
          
          if (storedAuth) {
            try {
              const authData = JSON.parse(storedAuth);
              setIsAuthenticated(true);
              setUser(authData.user);
            } catch (error) {
              console.error('Failed to parse stored auth data:', error);
              localStorage.removeItem('auth');
            }
          }
          
          // Generate a random score for demo purposes
          if (!userScore) {
            const generatedScore = generateRandomScore();
            generatedScore.masterKey = 'D!S4A-2003-EFGH'; // Use consistent master key
            setUserScore(generatedScore);
          }
          
          // Mark loading as complete
          setIsLoading(false);
        }, 300); // Small delay for better initialization in deployed environments
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login logic - in a real app, this would be an API call
    if (password.length >= 6) {
      const user = {
        id: '1',
        name: email.split('@')[0],
        email,
      };
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('auth', JSON.stringify({ user }));
      
      // Generate a score for the newly logged in user
      const generatedScore = generateRandomScore();
      generatedScore.masterKey = 'D!S4A-2003-EFGH'; // Set consistent master key
      setUserScore(generatedScore);
      
      return true;
    }
    
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserScore(null);
    localStorage.removeItem('auth');
  };
  
  // Update user score
  const updateUserScore = (newScore: UserScore) => {
    setUserScore(newScore);
  };
  
  // Context provider value
  const value = {
    isAuthenticated,
    user,
    userScore,
    login,
    logout,
    updateUserScore,
    isLoading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
