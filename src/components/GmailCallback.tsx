import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserData } from '@/utils/gmail';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function GmailCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('Connecting to Gmail...');

  useEffect(() => {
    const processAuth = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code received');
        }

        setStatus('Extracting data from Gmail...');
        const userData = await getUserData(code);

        // Store the user data in localStorage or your state management solution
        localStorage.setItem('gmailUserData', JSON.stringify(userData));

        toast({
          title: 'Gmail Connected Successfully',
          description: `Found ${userData.orders.length} orders in your Gmail.`,
        });

        // Redirect back to the integration page
        navigate('/integration', {
          state: { gmailConnected: true }
        });
      } catch (error) {
        console.error('Error processing Gmail auth:', error);
        toast({
          variant: 'destructive',
          title: 'Connection Failed',
          description: error instanceof Error ? error.message : 'Failed to connect to Gmail',
        });

        // Redirect back with error
        navigate('/integration', {
          state: { 
            gmailConnected: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        });
      }
    };

    processAuth();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gmail Integration
        </h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-center text-gray-500 dark:text-gray-400">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
} 