
import { Trophy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample leaderboard data
const leaderboardData = [
  { id: 1, user: 'User4392', score: 92, position: 1 },
  { id: 2, user: 'User8571', score: 88, position: 2 },
  { id: 3, user: 'User1203', score: 85, position: 3 },
  { id: 4, user: 'User9674', score: 82, position: 4 },
  { id: 5, user: 'You', score: 79, position: 5, highlight: true },
  { id: 6, user: 'User3289', score: 76, position: 6 },
  { id: 7, user: 'User5467', score: 73, position: 7 },
];

const LeaderboardCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                item.highlight 
                  ? 'bg-primary/10 dark:bg-primary/20' 
                  : 'hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  item.position <= 3 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {item.position}
                </div>
                <span className={item.highlight ? 'font-bold' : ''}>
                  {item.user}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.score}</span>
                {item.highlight && (
                  <Badge variant="outline" className="text-xs bg-primary/20">
                    You
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
