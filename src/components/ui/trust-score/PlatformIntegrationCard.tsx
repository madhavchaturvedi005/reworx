
import { useState } from 'react';
import { Platform, connectGmailAccount, extractOrdersFromGmail, processGmailOrderData } from '@/utils/trustScore';
import { Button } from "@/components/ui/button";
import { Link2, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import FadeIn from '../animations/FadeIn';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';

interface PlatformIntegrationCardProps {
  platform: Platform;
  onConnect?: (platform: Platform) => void;
  onDisconnect?: (platform: Platform) => void;
  className?: string;
}

const PlatformIntegrationCard = ({ 
  platform, 
  onConnect, 
  onDisconnect,
  className 
}: PlatformIntegrationCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  
  // Format last synced date
  const formatLastSynced = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  // Handle connect button click
  const handleConnectClick = () => {
    if (platform.id === 'gmail') {
      handleGmailConnect();
    } else {
      setShowLoginDialog(true);
    }
  };

  // Handle Gmail connection
  const handleGmailConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Connect to Gmail account
      const success = await connectGmailAccount();
      
      if (success) {
        // For demo purposes, simulate extracting and processing orders
        const mockAuthCode = "mock_auth_code_" + Date.now();
        const extractedOrders = await extractOrdersFromGmail(mockAuthCode);
        
        // Process the order data
        const orderHistory = processGmailOrderData(extractedOrders);
        
        console.log("Extracted and processed Gmail orders:", orderHistory);
        
        if (onConnect) {
          onConnect(platform);
        }
        
        toast({
          title: 'Gmail Connected',
          description: `Successfully connected Gmail and found ${extractedOrders.length} orders.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: 'Connection Failed',
          description: 'Failed to connect to Gmail. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error connecting to Gmail:", error);
      toast({
        variant: "destructive",
        title: 'Connection Error',
        description: 'An error occurred while connecting to Gmail.',
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle platform login
  const handleLogin = () => {
    setShowLoginDialog(false);
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      
      if (onConnect) {
        onConnect(platform);
      }
      
      toast({
        title: 'Platform Connected',
        description: `${platform.name} has been successfully connected.`,
      });
    }, 1500);
  };
  
  // Handle Google login
  const handleGoogleLogin = () => {
    setShowLoginDialog(false);
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      
      if (onConnect) {
        onConnect(platform);
      }
      
      toast({
        title: 'Platform Connected',
        description: `${platform.name} has been successfully connected via Google.`,
      });
    }, 1500);
  };
  
  // Handle phone login
  const handlePhoneLogin = () => {
    setShowLoginDialog(false);
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      
      if (onConnect) {
        onConnect(platform);
      }
      
      toast({
        title: 'Platform Connected',
        description: `${platform.name} has been successfully connected via Phone.`,
      });
    }, 1500);
  };
  
  // Handle disconnect
  const handleDisconnect = () => {
    setIsDisconnecting(true);
    
    // Simulate disconnection process
    setTimeout(() => {
      setIsDisconnecting(false);
      
      if (onDisconnect) {
        onDisconnect(platform);
      }
      
      toast({
        title: 'Platform Disconnected',
        description: `${platform.name} has been successfully disconnected.`,
      });
    }, 1500);
  };
  
  return (
    <>
      <div 
        className={cn(
          "p-5 rounded-xl glass-card overflow-hidden scale-on-hover",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex-shrink-0 bg-white dark:bg-gray-900 rounded-md p-1 flex items-center justify-center">
            <img 
              src={platform.logo} 
              alt={platform.name} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate">{platform.name}</h3>
            {platform.connected ? (
              <div className="flex items-center mt-1">
                <span className="flex items-center gap-1 text-xs font-medium text-trust-high">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
                <span className="inline-block mx-2 w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last synced: {formatLastSynced(platform.lastSynced)}
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {platform.id === 'gmail' ? 'Connect to extract e-commerce order data from your emails' : 'Connect to enhance your trust score'}
              </p>
            )}
          </div>
          
          <div>
            {platform.connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="h-8 px-3 text-xs"
              >
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleConnectClick}
                disabled={isConnecting}
                className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 flex items-center gap-1"
              >
                {isConnecting ? (
                  'Connecting...'
                ) : (
                  <>
                    <Link2 className="w-3 h-3" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <img 
                src={platform.logo} 
                alt={platform.name} 
                className="w-8 h-8 object-contain"
              />
              <DialogTitle>Connect to {platform.name}</DialogTitle>
            </div>
            <DialogDescription>
              Please sign in to your {platform.name} account to connect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={`Your ${platform.name} email`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleLogin}
            >
              Connect
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
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleLogin}
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
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePhoneLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Phone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlatformIntegrationCard;
