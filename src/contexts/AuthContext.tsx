
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedEmail = localStorage.getItem('userEmail');
    
    setIsAuthenticated(storedAuth);
    setUserEmail(storedEmail);
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials check
    if (email === 'demo@trustscore.com' && password === 'password123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      
      setIsAuthenticated(true);
      setUserEmail(email);
      
      return true;
    }
    
    return false;
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    setIsAuthenticated(false);
    setUserEmail(null);
  };
  
  if (isLoading) {
    return null; // Or a loading spinner
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
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
