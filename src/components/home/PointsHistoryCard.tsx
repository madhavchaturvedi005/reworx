
import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Sample points history data
const pointsHistory = [
  {
    id: 1,
    type: 'Order Completion',
    platform: 'Amazon',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    points: 150,
    action: 'add'
  },
  {
    id: 2,
    type: 'Special Offer',
    platform: 'Reworx',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100,
    action: 'add'
  },
  {
    id: 3,
    type: 'Reward Claimed',
    platform: 'Reworx',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    points: 200,
    action: 'subtract'
  },
  {
    id: 4,
    type: 'Order Completion',
    platform: 'Flipkart',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    points: 120,
    action: 'add'
  },
];

const PointsHistoryCard = () => {
  // Format date for display
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Points History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pointsHistory.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.platform} · {formatDate(item.date)}
                  </p>
                </div>
                <span className={`font-medium ${
                  item.action === 'add' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.action === 'add' ? '+' : '-'}{item.points}
                </span>
              </div>
              <Separator className="mt-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsHistoryCard;
