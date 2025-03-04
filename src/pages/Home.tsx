
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Gift, 
  History, 
  Link, 
  RefreshCw, 
  Trophy, 
  Users, 
  Wallet,
  Key,
  PlusCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import ScoreCard from '@/components/ui/trust-score/ScoreCard';
import PointsHistoryCard from '@/components/home/PointsHistoryCard';
import RewardsCard from '@/components/home/RewardsCard';
import LeaderboardCard from '@/components/home/LeaderboardCard';
import ConnectPlatformsCard from '@/components/home/ConnectPlatformsCard';

const Home = () => {
  const navigate = useNavigate();
  const { user, userScore } = useAuth();
  const { toast } = useToast();
  const [points, setPoints] = useState({
    total: 0,
    available: 0,
    spent: 0
  });
  
  useEffect(() => {
    // Calculate points based on user score
    if (userScore) {
      const totalPoints = Math.floor(userScore.score * 10);
      const spentPoints = Math.floor(totalPoints * 0.3); // Simulate 30% spent
      
      setPoints({
        total: totalPoints,
        available: totalPoints - spentPoints,
        spent: spentPoints
      });
    }
  }, [userScore]);
  
  const handleRefreshScore = () => {
    toast({
      title: "Score Refreshed",
      description: "Your trust score has been updated.",
    });
  };
  
  const handleViewAPICredentials = () => {
    toast({
      title: "API Credentials",
      description: userScore?.masterKey 
        ? `Your master key is: ${userScore.masterKey}` 
        : "You don't have a master key yet. Improve your score to get one.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <SlideIn className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {user?.name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                Your Trust Score is Ready!
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefreshScore}
                className="h-9"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Score
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewAPICredentials}
                className="h-9"
              >
                <Key className="mr-2 h-4 w-4" />
                API Credentials
              </Button>
              <Button 
                onClick={() => navigate('/integration')}
                className="h-9"
              >
                <Link className="mr-2 h-4 w-4" />
                Connect Platforms
              </Button>
            </div>
          </div>
        </SlideIn>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Section */}
          <FadeIn className="md:col-span-2" delay={100}>
            <div className="grid grid-cols-1 gap-6">
              {/* Score Card */}
              {userScore && (
                <ScoreCard 
                  score={userScore} 
                  onRefresh={handleRefreshScore} 
                />
              )}
              
              {/* Points Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Points Summary
                  </CardTitle>
                  <CardDescription>
                    Your earned and available points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-lg text-center">
                      <p className="text-xl font-bold">{points.total}</p>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {points.available}
                      </p>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {points.spent}
                      </p>
                      <p className="text-sm text-muted-foreground">Spent</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Next Reward: 1000 points</span>
                      <span className="text-sm font-medium">
                        {points.total}/1000
                      </span>
                    </div>
                    <Progress value={(points.total / 1000) * 100} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Rewards
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Rewards Card */}
              <RewardsCard />
            </div>
          </FadeIn>
          
          {/* Sidebar Cards */}
          <FadeIn className="md:col-span-1" delay={200}>
            <div className="grid grid-cols-1 gap-6">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>
                <TabsContent value="history">
                  <PointsHistoryCard />
                </TabsContent>
                <TabsContent value="leaderboard">
                  <LeaderboardCard />
                </TabsContent>
              </Tabs>
              
              <ConnectPlatformsCard />
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
