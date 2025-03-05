
import { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { userScore, updateUserScore } = useAuth();
  
  // Handle refresh score (just visual, doesn't actually change the score)
  const handleRefreshScore = () => {
    setIsRefreshing(true);
    
    // Simulate API call but don't actually change the score
    setTimeout(() => {
      setIsRefreshing(false);
      
      toast({
        title: 'Score Refreshed',
        description: 'Your trust score has been successfully updated.',
      });
    }, 1500);
  };
  
  // Handle connect platform (updates UI but keeps the same base score)
  const handleConnectPlatform = (platform: any) => {
    if (userScore) {
      const updatedPlatforms = userScore.platforms.map(p => 
        p.id === platform.id ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
      );
      
      // This doesn't actually change the persistent score in AuthContext
      toast({
        title: 'Platform Connected',
        description: `Successfully connected to ${platform.name}.`,
      });
    }
  };
  
  // Handle disconnect platform (updates UI but keeps the same base score)
  const handleDisconnectPlatform = (platform: any) => {
    if (userScore) {
      const updatedPlatforms = userScore.platforms.map(p => 
        p.id === platform.id ? { ...p, connected: false, lastSynced: undefined } : p
      );
      
      // This doesn't actually change the persistent score in AuthContext
      toast({
        title: 'Platform Disconnected',
        description: `Successfully disconnected from ${platform.name}.`,
      });
    }
  };
  
  // Handle master key change
  const handleMasterKeyChange = (newKey: string) => {
    if (userScore && updateUserScore) {
      updateUserScore({
        ...userScore,
        masterKey: newKey
      });
      
      toast({
        title: 'Master Key Updated',
        description: 'Your master key has been updated across the application.',
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
              <div className="flex items-center gap-4">
                <Link to="/home" className="hidden md:block">
                  <img src="/lovable-uploads/46d3e11e-52ab-4fb5-bfae-9875ba936ab6.png" alt="Reworx" className="h-8" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage your trust score and connected platforms
                  </p>
                </div>
              </div>
            </SlideIn>
            
            <FadeIn delay={200}>
              <Button 
                onClick={handleRefreshScore} 
                disabled={isRefreshing || !userScore}
                className="flex items-center gap-2"
              >
                <RefreshCw className={isRefreshing ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Score'}
              </Button>
            </FadeIn>
          </div>
          
          {!userScore ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl glass-card animate-pulse-subtle"
                  style={{ height: '400px' }}
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <SlideIn delay={100}>
                <ScoreCard score={userScore} />
              </SlideIn>
              
              <SlideIn delay={200}>
                <MasterKeyCard 
                  masterKey={userScore.masterKey} 
                  onMasterKeyChange={handleMasterKeyChange}
                />
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
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
