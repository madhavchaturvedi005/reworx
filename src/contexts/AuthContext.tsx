
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateRandomScore, UserScore } from '@/utils/trustScore';

// Define the user type
interface User {
  id: string;
  email: string;
  name?: string;
  // Add more user fields as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userScore: UserScore | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined demo user
const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@reworx.com',
  name: 'Demo User'
};

// Generate a static score for the demo user
const STATIC_USER_SCORE = generateRandomScore();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      // Always use the same static score for consistency
      setUserScore(STATIC_USER_SCORE);
    }
    
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials check
    if (email === 'demo@reworx.com' && password === 'password123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(DEMO_USER));
      
      setIsAuthenticated(true);
      setUser(DEMO_USER);
      setUserScore(STATIC_USER_SCORE);
      
      return true;
    }
    
    return false;
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setUserScore(null);
  };
  
  if (isLoading) {
    return null; // Or a loading spinner
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userScore, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
