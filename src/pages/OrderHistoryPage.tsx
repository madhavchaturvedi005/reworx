import { useState } from 'react';
import OrderHistory from '@/components/order-history/OrderHistory';
import { getUserData } from '@/utils/gmail';
import { useToast } from '@/components/ui/use-toast';

export default function OrderHistoryPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Get the stored auth code or redirect to Gmail integration
      const gmailData = localStorage.getItem('gmailUserData');
      if (!gmailData) {
        toast({
          variant: 'destructive',
          title: 'Not Connected',
          description: 'Please connect your Gmail account first.',
        });
        return;
      }

      // Re-sync data
      const code = JSON.parse(gmailData).code;
      const newData = await getUserData(code);
      localStorage.setItem('gmailUserData', JSON.stringify(newData));

      toast({
        title: 'Sync Complete',
        description: `Successfully synced ${newData.orders.length} orders.`,
      });
    } catch (error) {
      console.error('Error syncing orders:', error);
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: 'Failed to sync orders. Please try again.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OrderHistory onSync={handleSync} />
    </div>
  );
} 