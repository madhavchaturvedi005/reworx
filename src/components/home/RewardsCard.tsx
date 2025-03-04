
import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample rewards data
const rewards = [
  {
    id: 1,
    name: '10% Discount on Next Purchase',
    provider: 'Amazon',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    code: 'RWRX10DISC'
  },
  {
    id: 2,
    name: 'Free Shipping for 3 Months',
    provider: 'Flipkart',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    code: 'RWRXFREESHIP'
  },
  {
    id: 3,
    name: '$20 Store Credit',
    provider: 'Myntra',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired',
    code: 'RWRX20CR'
  }
];

const RewardsCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Format date for display
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const activeRewards = rewards.filter(reward => reward.status === 'active');
  const expiredRewards = rewards.filter(reward => reward.status === 'expired');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Claimed Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeRewards.length > 0 ? (
          <div>
            <div className="flex justify-between mb-4">
              <div className="flex gap-1 items-center">
                {activeRewards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === activeIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeIndex + 1} / {activeRewards.length}
              </div>
            </div>
            
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {activeRewards.map((reward) => (
                  <div key={reward.id} className="min-w-full">
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg">{reward.name}</h3>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        From: {reward.provider}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Expires: {formatDate(reward.expiryDate)}
                      </p>
                      
                      <div className="bg-black/5 dark:bg-white/5 p-3 rounded-md">
                        <p className="text-xs mb-1">Reward Code:</p>
                        <p className="font-mono text-center font-bold tracking-wider">
                          {reward.code}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {expiredRewards.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Expired Rewards</h4>
                <div className="space-y-2">
                  {expiredRewards.map((reward) => (
                    <div key={reward.id} className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{reward.name}</p>
                        <Badge variant="outline" className="text-xs">Expired</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {reward.provider} · Expired on {formatDate(reward.expiryDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No rewards claimed yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
