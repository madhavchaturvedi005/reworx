
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Check, UserRound, Key, Bell, Shield, RefreshCw } from 'lucide-react';
import { createNewMasterKey } from '@/utils/trustScore';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';

const Settings = () => {
  const [masterKey, setMasterKey] = useState('ABCD-1234-EFGH');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifications, setNotifications] = useState({
    scoreUpdates: true,
    platformSync: true,
    offerAlerts: false,
    marketingEmails: false,
  });
  const { toast } = useToast();
  
  // Format the master key display
  const formatMasterKey = () => {
    if (!masterKey) return '';
    
    if (isRevealed) {
      return masterKey;
    }
    
    // Hide the key with bullets
    return masterKey.replace(/[A-Z0-9]/g, '•');
  };
  
  // Handle regenerate master key
  const handleRegenerateKey = () => {
    setIsRegenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey = createNewMasterKey();
      setMasterKey(newKey);
      setIsRevealed(true);
      setIsRegenerating(false);
      
      toast({
        title: 'Master Key Updated',
        description: 'Your master key has been successfully regenerated.',
      });
    }, 1500);
  };
  
  // Handle save account settings
  const handleSaveAccountSettings = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      
      toast({
        title: 'Settings Updated',
        description: 'Your account settings have been successfully updated.',
      });
    }, 1000);
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          <SlideIn className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </SlideIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <FadeIn className="sticky top-24">
                <nav className="space-y-1">
                  <a 
                    href="#account" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 text-primary font-medium"
                  >
                    <UserRound className="h-5 w-5" />
                    Account
                  </a>
                  <a 
                    href="#master-key" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/30 font-medium"
                  >
                    <Key className="h-5 w-5" />
                    Master Key
                  </a>
                  <a 
                    href="#notifications" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/30 font-medium"
                  >
                    <Bell className="h-5 w-5" />
                    Notifications
                  </a>
                  <a 
                    href="#privacy" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/30 font-medium"
                  >
                    <Shield className="h-5 w-5" />
                    Privacy
                  </a>
                </nav>
              </FadeIn>
            </div>
            
            <div className="md:col-span-2 space-y-10">
              <FadeIn delay={100} className="p-6 glass-card rounded-xl" id="account">
                <div className="flex items-center gap-4 mb-6">
                  <UserRound className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Account Settings</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value="••••••••••" readOnly />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated 2 months ago
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleSaveAccountSettings}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </FadeIn>
              
              <FadeIn delay={200} className="p-6 glass-card rounded-xl" id="master-key">
                <div className="flex items-center gap-4 mb-6">
                  <Key className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Master Key</h2>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Your master key is used to verify your trust score with partner companies.
                    If you regenerate your key, the previous one will no longer work.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 flex-1 rounded-lg text-center font-mono text-lg tracking-wider">
                      {formatMasterKey()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRevealed(!isRevealed)}
                    >
                      {isRevealed ? 'Hide' : 'Reveal'}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerateKey}
                    disabled={isRegenerating}
                    className="w-full justify-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    {isRegenerating ? 'Regenerating...' : 'Regenerate Master Key'}
                  </Button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last regenerated: 30 days ago
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={300} className="p-6 glass-card rounded-xl" id="notifications">
                <div className="flex items-center gap-4 mb-6">
                  <Bell className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Notification Preferences</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Score Updates</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications when your trust score changes
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.scoreUpdates}
                      onCheckedChange={() => handleNotificationToggle('scoreUpdates')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Platform Sync</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when platforms are synced
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.platformSync}
                      onCheckedChange={() => handleNotificationToggle('platformSync')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Offer Alerts</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive alerts about new offers from partner companies
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.offerAlerts}
                      onCheckedChange={() => handleNotificationToggle('offerAlerts')}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Marketing Emails</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.marketingEmails}
                      onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                    />
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={400} className="p-6 glass-card rounded-xl" id="privacy">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Privacy & Data</h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    We take your privacy seriously. Your data is only used to calculate your trust score and is never shared with third parties without your consent.
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-base font-medium mb-2">Data Collection</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      We collect the following data from your connected e-commerce platforms:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-trust-high mt-0.5" />
                        <span>Order history (number of orders, dates)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-trust-high mt-0.5" />
                        <span>Order status (accepted, cancelled, rejected)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-trust-high mt-0.5" />
                        <span>Purchase frequency and consistency</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline">Download My Data</Button>
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/5">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
