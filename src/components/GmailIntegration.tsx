import { useState } from 'react';
import { createOAuth2Client, generateOAuthUrl, getUserData, GmailUserData } from '@/utils/gmail';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Loader2 } from 'lucide-react';

export default function GmailIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<GmailUserData | null>(null);
  const { toast } = useToast();

  const handleGmailConnect = async () => {
    try {
      setIsLoading(true);
      const oauth2Client = createOAuth2Client();
      const authUrl = generateOAuthUrl(oauth2Client);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Gmail:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to Gmail. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Gmail Integration</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your Gmail account to extract e-commerce order data
        </p>
      </div>

      {userData ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              {userData.profile?.picture && (
                <img
                  src={userData.profile.picture}
                  alt={userData.name || userData.email}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <h3 className="font-medium">{userData.name || userData.email}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Order Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Total Orders:</span>
                <span className="font-medium">{userData.orders.length}</span>

                <span>Delivered:</span>
                <span className="font-medium">
                  {userData.orders.filter(order => order.status === 'delivered').length}
                </span>

                <span>Processing:</span>
                <span className="font-medium">
                  {userData.orders.filter(order => order.status === 'processing').length}
                </span>

                <span>Cancelled/Returned:</span>
                <span className="font-medium">
                  {userData.orders.filter(order => 
                    order.status === 'cancelled' || order.status === 'returned'
                  ).length}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setUserData(null)}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          className="w-full"
          onClick={handleGmailConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Connect Gmail
            </>
          )}
        </Button>
      )}
    </div>
  );
} 