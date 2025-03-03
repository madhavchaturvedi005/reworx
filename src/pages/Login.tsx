
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LogIn, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back to Reworx!',
        });
        
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulating Google login success
      setTimeout(async () => {
        const success = await login('demo@reworx.com', 'password123');
        
        if (success) {
          toast({
            title: 'Google Login Successful',
            description: 'Welcome back to Reworx!',
          });
          
          navigate('/dashboard');
        }
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('An error occurred with Google login. Please try again.');
      console.error(err);
      setIsLoading(false);
    }
  };
  
  const handleSendOtp = () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsPhoneLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtpInput(true);
      setIsPhoneLoading(false);
      
      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to ${phoneNumber}`,
      });
    }, 1500);
  };
  
  const handlePhoneLogin = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    setIsPhoneLoading(true);
    
    try {
      // Simulating Phone login success
      setTimeout(async () => {
        const success = await login('demo@reworx.com', 'password123');
        
        if (success) {
          toast({
            title: 'Phone Login Successful',
            description: 'Welcome back to Reworx!',
          });
          
          navigate('/dashboard');
        }
        setIsPhoneLoading(false);
      }, 1500);
    } catch (err) {
      setError('An error occurred with phone login. Please try again.');
      console.error(err);
      setIsPhoneLoading(false);
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
            <Tabs defaultValue="email" className="mb-4">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                        or continue with
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" aria-hidden="true">
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2704 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="phone">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={showOtpInput}
                      />
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isPhoneLoading || showOtpInput}
                        className="whitespace-nowrap"
                      >
                        {isPhoneLoading && !showOtpInput ? 'Sending...' : 'Send OTP'}
                      </Button>
                    </div>
                  </div>
                  
                  {showOtpInput && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter the 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                    </div>
                  )}
                  
                  {error && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  
                  {showOtpInput && (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handlePhoneLogin}
                      disabled={isPhoneLoading}
                    >
                      {isPhoneLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Verify and Sign In
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'Sign-up functionality will be available soon!'
                    });
                  }}
                >
                  Sign up
                </Button>
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
                Demo credentials:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">Email:</span> demo@reworx.com
                </div>
                <div>
                  <span className="font-medium">Password:</span> password123
                </div>
              </div>
            </div>
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
