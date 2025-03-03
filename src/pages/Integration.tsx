
import { useState } from 'react';
import { availablePlatforms, Platform } from '@/utils/trustScore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlatformIntegrationCard from '@/components/ui/trust-score/PlatformIntegrationCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';

const Integration = () => {
  const [platforms, setPlatforms] = useState<Platform[]>(availablePlatforms);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Handle connect platform
  const handleConnectPlatform = (platform: Platform) => {
    setPlatforms(platforms.map(p => 
      p.id === platform.id ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
    ));
    
    toast({
      title: 'Platform Connected',
      description: `${platform.name} has been successfully connected.`,
    });
  };
  
  // Handle disconnect platform
  const handleDisconnectPlatform = (platform: Platform) => {
    setPlatforms(platforms.map(p => 
      p.id === platform.id ? { ...p, connected: false, lastSynced: undefined } : p
    ));
    
    toast({
      title: 'Platform Disconnected',
      description: `${platform.name} has been successfully disconnected.`,
    });
  };
  
  // Filter platforms based on search query
  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          <SlideIn className="mb-6">
            <h1 className="text-3xl font-bold">Platform Integration</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Connect your e-commerce platforms to enhance your trust score
            </p>
          </SlideIn>
          
          <FadeIn delay={200} className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search platforms..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </FadeIn>
          
          <div className="space-y-4">
            {filteredPlatforms.length > 0 ? (
              filteredPlatforms.map((platform, index) => (
                <FadeIn key={platform.id} delay={index * 100}>
                  <PlatformIntegrationCard 
                    platform={platform}
                    onConnect={handleConnectPlatform}
                    onDisconnect={handleDisconnectPlatform}
                    className="max-w-3xl"
                  />
                </FadeIn>
              ))
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">No platforms found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  We couldn't find any platforms matching "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
          
          <FadeIn delay={300} className="mt-12 p-6 bg-primary/5 rounded-xl max-w-3xl">
            <h3 className="text-lg font-medium mb-2">Don't see your platform?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're constantly adding new platforms. If you don't see your preferred e-commerce platform, let us know and we'll prioritize adding it.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: 'Request Received',
                  description: "Thanks for letting us know! We'll add more platforms soon.",
                });
              }}
            >
              Request a Platform
            </Button>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Integration;
