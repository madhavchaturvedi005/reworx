import { useState } from 'react';
import OrderHistory from '@/components/order-history/OrderHistory';
import { useToast } from '@/components/ui/use-toast';

export default function OrderHistoryPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Implement platform-specific sync logic
      toast({
        title: 'Sync Complete',
        description: 'Successfully synced orders.',
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
      <OrderHistory orders={[]} />
    </div>
  );
} 