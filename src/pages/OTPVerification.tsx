import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { ArrowLeft, Loader2 } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const getEmailFromSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.email) {
          setEmail(sessionData.session.user.email);
        } else {
          const storedEmail = localStorage.getItem('verificationEmail');
          if (storedEmail) {
            setEmail(storedEmail);
          } else {
            setError('No email found. Please go back and login again.');
            toast({
              title: 'Error',
              description: 'No email found. Please go back and login again.',
              variant: 'destructive'
            });
          }
        }
      } catch (err) {
        console.error('Error retrieving session:', err);
      }
    };
    
    getEmailFromSession();
    
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isAuthenticated, navigate, toast]);
  
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    if (!email) {
      setError('Email not found. Please go back to login page.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        toast({
          title: 'Verification Successful',
          description: 'Your email has been verified.',
        });
        
        localStorage.removeItem('verificationEmail');
        
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid verification code. Please try again.');
      toast({
        title: 'Verification Failed',
        description: err.message || 'Invalid verification code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    if (!canResend) return;
    if (!email) {
      setError('Email not found. Please go back to login page.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent to your email.',
      });
      
      setTimeLeft(60);
      setCanResend(false);
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend code. Please try again.');
      toast({
        title: 'Resend Failed',
        description: err.message || 'Failed to resend code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <SlideIn>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <img src="/lovable-uploads/4faf26ec-4a33-45c3-a3fe-964fab70e056.png" alt="Reworx" className="w-10 h-10" />
              <span className="font-semibold text-2xl tracking-tight">Reworx</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please enter the verification code sent to {email ? email : 'your email'}
            </p>
          </div>
        </SlideIn>
        
        <FadeIn delay={100}>
          <Card>
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>
                Enter the 6-digit code we sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                
                {error && (
                  <div className="text-sm text-red-500 dark:text-red-400 text-center mt-2">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full" 
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : 'Verify Code'}
              </Button>
              
              <div className="text-center w-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive a code?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={handleResendOTP}
                    disabled={!canResend || isLoading}
                  >
                    {canResend ? 'Resend code' : `Resend in ${timeLeft}s`}
                  </Button>
                </p>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </CardFooter>
          </Card>
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

export default OTPVerification;
