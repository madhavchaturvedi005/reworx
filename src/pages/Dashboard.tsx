
import { useState, useEffect } from 'react';
import { getUserScore, UserScore } from '@/utils/trustScore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScoreCard from '@/components/ui/trust-score/ScoreCard';
import MasterKeyCard from '@/components/ui/trust-score/MasterKeyCard';
import PlatformIntegrationCard from '@/components/ui/trust-score/PlatformIntegrationCard';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Fetch user score on component mount
  useEffect(() => {
    fetchUserScore();
  }, []);
  
  // Fetch user score
  const fetchUserScore = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const score = getUserScore();
      setUserScore(score);
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle refresh score
  const handleRefreshScore = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      const score = getUserScore();
      setUserScore(score);
      setIsRefreshing(false);
      
      toast({
        title: 'Score Refreshed',
        description: 'Your trust score has been successfully updated.',
      });
    }, 1500);
  };
  
  // Handle connect platform
  const handleConnectPlatform = (platform: any) => {
    if (userScore) {
      const updatedPlatforms = userScore.platforms.map(p => 
        p.id === platform.id ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
      );
      
      setUserScore({
        ...userScore,
        platforms: updatedPlatforms,
        score: Math.min(userScore.score + 5, 95),
      });
    }
  };
  
  // Handle disconnect platform
  const handleDisconnectPlatform = (platform: any) => {
    if (userScore) {
      const updatedPlatforms = userScore.platforms.map(p => 
        p.id === platform.id ? { ...p, connected: false, lastSynced: undefined } : p
      );
      
      setUserScore({
        ...userScore,
        platforms: updatedPlatforms,
        score: Math.max(userScore.score - 5, 25),
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SlideIn>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your trust score and connected platforms
              </p>
            </SlideIn>
            
            <FadeIn delay={200}>
              <Button 
                onClick={handleRefreshScore} 
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={isRefreshing ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Score'}
              </Button>
            </FadeIn>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl glass-card animate-pulse-subtle"
                  style={{ height: '400px' }}
                ></div>
              ))}
            </div>
          ) : userScore ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <SlideIn delay={100}>
                <ScoreCard score={userScore} />
              </SlideIn>
              
              <SlideIn delay={200}>
                <MasterKeyCard masterKey={userScore.masterKey} />
              </SlideIn>
              
              <FadeIn delay={300} className="lg:col-span-1 md:col-span-2">
                <div className="p-6 rounded-2xl glass-card h-full">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                    Connected Platforms
                  </h3>
                  
                  <div className="space-y-3">
                    {userScore.platforms.map((platform, index) => (
                      <FadeIn key={platform.id} delay={index * 100}>
                        <PlatformIntegrationCard 
                          platform={platform}
                          onConnect={handleConnectPlatform}
                          onDisconnect={handleDisconnectPlatform}
                        />
                      </FadeIn>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Connect more platforms to increase your trust score. 
                      Each connected platform enhances your score.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">
                Failed to load trust score. Please try again.
              </p>
              <Button 
                onClick={fetchUserScore} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
