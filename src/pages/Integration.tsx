
import { useState } from 'react';
import { availablePlatforms, Platform, extractOrdersFromGmail, processGmailOrderData } from '@/utils/trustScore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlatformIntegrationCard from '@/components/ui/trust-score/PlatformIntegrationCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PlatformRequestForm from '@/components/home/PlatformRequestForm';
import { Link } from 'react-router-dom';

const Integration = () => {
  const [platforms, setPlatforms] = useState<Platform[]>(availablePlatforms);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGmailSuccess, setShowGmailSuccess] = useState(false);
  const [gmailOrdersCount, setGmailOrdersCount] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();
  
  // Handle connect platform
  const handleConnectPlatform = async (platform: Platform) => {
    if (platform.id === 'gmail') {
      // For Gmail, we'll show a success dialog with more details
      try {
        // Simulate auth code from OAuth flow
        const mockAuthCode = "mock_auth_code_" + Date.now();
        
        // Extract orders from Gmail
        const extractedOrders = await extractOrdersFromGmail(mockAuthCode);
        setGmailOrdersCount(extractedOrders.length);
        
        // Update platforms state
        setPlatforms(platforms.map(p => 
          p.id === platform.id ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
        ));
        
        // Show success dialog
        setShowGmailSuccess(true);
      } catch (error) {
        console.error("Error processing Gmail orders:", error);
        toast({
          variant: "destructive",
          title: 'Processing Error',
          description: 'An error occurred while processing your Gmail data.',
        });
      }
    } else {
      // For other platforms, just update state
      setPlatforms(platforms.map(p => 
        p.id === platform.id ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
      ));
      
      toast({
        title: 'Platform Connected',
        description: `${platform.name} has been successfully connected.`,
      });
    }
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
          <SlideIn className="mb-6 flex items-center gap-4">
            <Link to="/home">
              <img src="/lovable-uploads/46d3e11e-52ab-4fb5-bfae-9875ba936ab6.png" alt="Reworx" className="h-8" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Platform Integration</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Connect your e-commerce platforms to enhance your trust score
              </p>
            </div>
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
              onClick={() => setFormOpen(true)}
            >
              Request a Platform
            </Button>
          </FadeIn>
        </div>
      </main>
      
      <Footer />

      {/* Platform Request Form */}
      <PlatformRequestForm open={formOpen} onOpenChange={setFormOpen} />

      {/* Gmail Success Dialog */}
      <Dialog open={showGmailSuccess} onOpenChange={setShowGmailSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <DialogTitle>Gmail Connected Successfully</DialogTitle>
            </div>
            <DialogDescription>
              We've successfully connected to your Gmail account and found your e-commerce orders.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Total Orders:</span>
                </div>
                <span className="font-medium">{gmailOrdersCount}</span>
                
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Delivered:</span>
                </div>
                <span className="font-medium">2</span>
                
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span>Processing:</span>
                </div>
                <span className="font-medium">1</span>
                
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Returned/Cancelled:</span>
                </div>
                <span className="font-medium">1</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your trust score has been updated based on your order history.
              We'll periodically sync with your Gmail to keep your score up to date.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full" 
              onClick={() => setShowGmailSuccess(false)}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integration;
