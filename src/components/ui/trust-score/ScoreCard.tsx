
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserScore, getScoreLevel } from '@/utils/trustScore';
import { cn } from '@/lib/utils';
import { ClipboardCopy, Info, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

interface ScoreCardProps {
  score: UserScore;
  className?: string;
  onRefresh?: () => void;
}

const ScoreCard = ({ score, className, onRefresh }: ScoreCardProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Get color based on score level
  const getScoreColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  // Get background color based on score level
  const getScoreBgColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-red-100 dark:bg-red-950/30';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-950/30';
      case 'high':
        return 'bg-green-100 dark:bg-green-950/30';
      default:
        return 'bg-blue-100 dark:bg-blue-950/30';
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      
      // Simulate API delay
      setTimeout(() => {
        onRefresh();
        setIsRefreshing(false);
        
        toast({
          title: 'Score Refreshed',
          description: 'Your trust score has been updated with the latest data.',
        });
      }, 1500);
    }
  };

  // Handle copy score button click
  const handleCopyScore = () => {
    navigator.clipboard.writeText(score.score.toString());
    
    toast({
      title: 'Score Copied',
      description: 'Your trust score has been copied to the clipboard.',
    });
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">Your Trust Score</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on {score.orderHistory.total} orders
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-end gap-2 mb-2">
          <h2 className={cn("text-4xl font-bold", getScoreColor(score.level))}>
            {score.score}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">/ 100</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 mb-1.5">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm max-w-xs">
                  Your trust score is calculated based on your order history, 
                  acceptance rate, and platform activity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Progress 
          value={score.score} 
          className="h-2 mb-4"
        />
        
        <div className={cn(
          "flex justify-between items-center p-3 rounded-md mt-4",
          getScoreBgColor(score.level)
        )}>
          <div>
            <p className="text-sm font-medium">Trust Level: {score.level.charAt(0).toUpperCase() + score.level.slice(1)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {score.level === 'high' 
                ? 'Excellent! You have a great trust score.' 
                : score.level === 'medium' 
                  ? 'Good! Your trust score is average.' 
                  : 'Improve your trust score by accepting more orders.'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleCopyScore}
          >
            <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScoreCard;
