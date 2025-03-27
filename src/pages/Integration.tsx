import { useState } from 'react';
import { availablePlatforms, Platform } from '@/utils/trustScore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlatformIntegrationCard from '@/components/ui/trust-score/PlatformIntegrationCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Mail, ClipboardList } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PlatformRequestForm from '@/components/home/PlatformRequestForm';
import { Link, useNavigate } from 'react-router-dom';

const Integration = () => {
  const [platforms, setPlatforms] = useState<Platform[]>(availablePlatforms);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Handle connect platform
  const handleConnectPlatform = async (platform: Platform) => {
    try {
      // Update platforms state
      setPlatforms(platforms.map(p => 
        p.id === platform.id ? { ...p, connected: true, lastSynced: new Date().toISOString() } : p
      ));
      
      toast({
        title: 'Success',
        description: `Successfully connected to ${platform.name}`,
      });
    } catch (error) {
      console.error("Error connecting to platform:", error);
      toast({
        variant: "destructive",
        title: 'Connection Error',
        description: 'An error occurred while connecting to the platform.',
      });
    }
  };

  // Handle disconnect platform
  const handleDisconnectPlatform = (platform: Platform) => {
    setPlatforms(platforms.map(p => 
      p.id === platform.id ? { ...p, connected: false, lastSynced: null } : p
    ));
    
    toast({
      title: 'Disconnected',
      description: `Successfully disconnected from ${platform.name}`,
    });
  };

  // Filter platforms based on search query
  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Platform Integrations</h1>
            <p className="text-muted-foreground mb-8">
              Connect your e-commerce platforms to automatically sync your order data.
            </p>

            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setFormOpen(true)}>
                Request New Platform
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredPlatforms.map((platform) => (
                <SlideIn key={platform.id}>
                  <PlatformIntegrationCard
                    platform={platform}
                    onConnect={() => handleConnectPlatform(platform)}
                    onDisconnect={() => handleDisconnectPlatform(platform)}
                  />
                </SlideIn>
              ))}
            </div>

            {filteredPlatforms.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No platforms found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search query or request a new platform.
                </p>
                <Button onClick={() => setFormOpen(true)}>
                  Request New Platform
                </Button>
              </div>
            )}
          </div>
        </FadeIn>
      </main>
      <Footer />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Platform</DialogTitle>
            <DialogDescription>
              Let us know which platform you'd like to integrate with.
            </DialogDescription>
          </DialogHeader>
          <PlatformRequestForm onClose={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integration;
