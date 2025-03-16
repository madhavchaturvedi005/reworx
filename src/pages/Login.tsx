
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LogIn, Smartphone, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';

const Login = () => {
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Signup states
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, isLoading: authLoading } = useAuth();
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use Supabase directly for login with email OTP option
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.session) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back to Reworx!',
        });
        
        navigate('/dashboard');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
      toast({
        title: 'Login Failed',
        description: err.message || 'Invalid email or password',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    
    if (!signupName || !signupEmail || !signupPassword || !confirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use Supabase directly for signup
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: signupName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for a verification link.',
        });
        
        // Redirect to OTP verification page
        navigate('/otp-verification');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setSignupError(err.message || 'Failed to create account. Please try again.');
      toast({
        title: 'Signup Failed',
        description: err.message || 'Failed to create account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store email in localStorage for OTP verification
      localStorage.setItem('verificationEmail', email);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false // Don't create a new user if one doesn't exist
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Verification Code Sent',
        description: 'Please check your email for a verification code.',
      });
      
      // Redirect to OTP verification page
      navigate('/otp-verification');
    } catch (err: any) {
      console.error('OTP login error:', err);
      setError(err.message || 'Failed to send verification code. Please try again.');
      toast({
        title: 'Verification Failed',
        description: err.message || 'Failed to send verification code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <SlideIn>
            <div className="inline-flex items-center gap-2 mb-2">
              <img src="/lovable-uploads/4faf26ec-4a33-45c3-a3fe-964fab70e056.png" alt="Reworx" className="w-10 h-10" />
              <span className="font-semibold text-2xl tracking-tight">Reworx</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to access your trust score dashboard
            </p>
          </SlideIn>
        </div>
        
        <FadeIn delay={100}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {isSigningUp ? (
              // Signup form
              <form onSubmit={handleSignup} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Create an Account</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="signupName">Name</Label>
                  <Input
                    id="signupName"
                    placeholder="Enter your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="sr-only">
                        {showSignupPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </div>
                
                {signupError && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {signupError}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </span>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setIsSigningUp(false)}
                      type="button"
                    >
                      Sign in
                    </Button>
                  </p>
                </div>
              </form>
            ) : (
              // Login form
              <Tabs defaultValue="email" className="mb-4">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="email">Password</TabsTrigger>
                  <TabsTrigger value="otp">OTP</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-sm text-red-500 dark:text-red-400">
                        {error}
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <LogIn className="h-4 w-4" />
                          Sign In
                        </span>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Don't have an account?{' '}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={() => setIsSigningUp(true)}
                          type="button"
                        >
                          Sign up
                        </Button>
                      </p>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="otp">
                  <form onSubmit={handleOTPLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otpEmail">Email</Label>
                      <Input
                        id="otpEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    {error && (
                      <div className="text-sm text-red-500 dark:text-red-400">
                        {error}
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending code...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Send Verification Code
                        </span>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Don't have an account?{' '}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={() => setIsSigningUp(true)}
                          type="button"
                        >
                          Sign up
                        </Button>
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </FadeIn>
        
        <FadeIn delay={200}>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-8">
            © {new Date().getFullYear()} Reworx. All rights reserved.
          </p>
        </FadeIn>
      </div>
    </div>
  );
};

export default Login;
