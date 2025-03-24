import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Filter, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GmailOrder } from '@/utils/gmail';

interface OrderHistoryProps {
  onSync?: () => Promise<void>;
}

export default function OrderHistory({ onSync }: OrderHistoryProps) {
  const [orders, setOrders] = useState<GmailOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<GmailOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('all');

  // Load orders from localStorage on mount
  useEffect(() => {
    const loadOrders = () => {
      const gmailData = localStorage.getItem('gmailUserData');
      if (gmailData) {
        const { orders } = JSON.parse(gmailData);
        setOrders(orders);
        setFilteredOrders(orders);
      }
    };

    loadOrders();
  }, []);

  // Apply filters when filter values change
  useEffect(() => {
    let filtered = [...orders];

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(order => new Date(order.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(order => new Date(order.date) <= new Date(endDate));
    }

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredOrders(filtered);
  }, [orders, startDate, endDate, status]);

  // Handle sync button click
  const handleSync = async () => {
    if (!onSync) return;

    setIsLoading(true);
    try {
      await onSync();
      // Reload orders after sync
      const gmailData = localStorage.getItem('gmailUserData');
      if (gmailData) {
        const { orders: newOrders } = JSON.parse(gmailData);
        setOrders(newOrders);
      }
    } catch (error) {
      console.error('Error syncing orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Button
          variant="outline"
          onClick={handleSync}
          disabled={isLoading || !onSync}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Sync Orders
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found. Please sync your account to fetch order history.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.orderId} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium">{order.merchant}</h3>
                  <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order.date), 'PPP')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">₹{order.amount.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{product.name} × {product.quantity}</span>
                      <span>₹{product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 