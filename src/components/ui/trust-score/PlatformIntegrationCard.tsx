
import { useState } from 'react';
import { Platform } from '@/utils/trustScore';
import { Button } from "@/components/ui/button";
import { Link2, AlertCircle, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import FadeIn from '../animations/FadeIn';

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
  
  // Handle connect
  const handleConnect = () => {
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
              Connect to enhance your trust score
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
              onClick={handleConnect}
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
  );
};

export default PlatformIntegrationCard;
