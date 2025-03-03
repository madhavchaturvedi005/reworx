
import { useState, useEffect } from 'react';
import { UserScore } from '@/utils/trustScore';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: UserScore;
  className?: string;
}

const ScoreCard = ({ score, className }: ScoreCardProps) => {
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    // Animate the progress value
    const timer = setTimeout(() => {
      setProgressValue(score.score);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [score.score]);
  
  // Score label based on level
  const getLevelLabel = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Needs Improvement';
      case 'medium':
        return 'Good Standing';
      case 'high':
        return 'Excellent';
      default:
        return '';
    }
  };
  
  // Get color based on score level
  const getLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-trust-low';
      case 'medium':
        return 'text-trust-medium';
      case 'high':
        return 'text-trust-high';
      default:
        return '';
    }
  };
  
  // Get progress color based on score level
  const getProgressColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-trust-low';
      case 'medium':
        return 'bg-trust-medium';
      case 'high':
        return 'bg-trust-high';
      default:
        return '';
    }
  };
  
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl glass-card overflow-hidden scale-on-hover",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Your Trust Score
        </h3>
        
        <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-800 mb-6 relative">
          <div className="text-center">
            <span className="block text-4xl font-bold">{score.score}</span>
            <span 
              className={cn(
                "text-sm font-medium",
                getLevelColor(score.level)
              )}
            >
              {getLevelLabel(score.level)}
            </span>
          </div>
        </div>
        
        <div className="w-full space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Poor</span>
            <span className="text-gray-500 dark:text-gray-400">Excellent</span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2 bg-gray-100 dark:bg-gray-800"
            indicatorClassName={cn(
              "transition-all duration-1000 ease-out",
              getProgressColor(score.level)
            )}
          />
        </div>
        
        <div className="w-full grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xl font-bold">{score.orderHistory.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{score.orderHistory.accepted}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Accepted</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{score.orderHistory.cancelled}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
