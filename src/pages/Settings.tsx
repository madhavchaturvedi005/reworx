import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MasterKeyCard from '@/components/ui/trust-score/MasterKeyCard';
import { Check, Copy, Info, Mail, Shield, User, ArrowLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import FadeIn from '@/components/ui/animations/FadeIn';
import SlideIn from '@/components/ui/animations/SlideIn';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Settings = () => {
  const { user, userScore, updateUserScore } = useAuth();
  
  // User data state
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    masterKey: userScore?.masterKey || '',
  });
  
  // Update userData when auth context changes
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
    
    if (userScore) {
      setUserData(prev => ({
        ...prev,
        masterKey: userScore.masterKey || '',
      }));
    }
  }, [user, userScore]);
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dataSharingConsent: true,
    twoFactorAuth: false,
    dataRetention: false,
  });
  
  // Load user settings from Supabase
  useEffect(() => {
    const loadUserSettings = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (data) {
            setSettings({
              emailNotifications: data.email_notifications,
              dataSharingConsent: data.data_sharing_consent,
              twoFactorAuth: data.two_factor_auth,
              dataRetention: data.data_retention,
            });
          }
        } catch (error) {
          console.error('Error loading user settings:', error);
        }
      }
    };
    
    loadUserSettings();
  }, [user]);
  
  // Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newName, setNewName] = useState(userData.name);
  const [newEmail, setNewEmail] = useState(userData.email);
  
  // Copy states
  const [nameCopied, setNameCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Handle toggle changes
  const handleToggleChange = async (key: keyof typeof settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    
    setSettings(newSettings);
    
    // Update settings in Supabase
    if (user) {
      try {
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          email_notifications: newSettings.emailNotifications,
          data_sharing_consent: newSettings.dataSharingConsent,
          two_factor_auth: newSettings.twoFactorAuth,
          data_retention: newSettings.dataRetention,
        });
        
        toast({
          title: 'Setting Updated',
          description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${!settings[key] ? 'enabled' : 'disabled'}.`,
        });
      } catch (error) {
        console.error('Error updating settings:', error);
        
        // Revert the setting if there was an error
        setSettings(settings);
        
        toast({
          title: 'Error',
          description: 'Failed to update setting. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Handle copy to clipboard
  const handleCopy = (text: string, type: 'name' | 'email') => {
    navigator.clipboard.writeText(text);
    
    if (type === 'name') {
      setNameCopied(true);
      setTimeout(() => setNameCopied(false), 2000);
    } else {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
    
    toast({
      title: 'Copied to Clipboard',
      description: `Your ${type} has been copied to the clipboard.`,
    });
  };
  
  // Handle name update
  const handleNameUpdate = async () => {
    if (newName.trim() !== '' && user) {
      try {
        await supabase
          .from('profiles')
          .update({ name: newName })
          .eq('id', user.id);
        
        setUserData({
          ...userData,
          name: newName,
        });
        
        setIsEditingName(false);
        
        toast({
          title: 'Name Updated',
          description: 'Your name has been successfully updated.',
        });
      } catch (error) {
        console.error('Error updating name:', error);
        
        toast({
          title: 'Error',
          description: 'Failed to update name. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Handle email update
  const handleEmailUpdate = async () => {
    if (newEmail.trim() !== '' && newEmail.includes('@') && user) {
      try {
        // Update email in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
          email: newEmail,
        });
        
        if (authError) throw authError;
        
        // Update email in profiles table
        await supabase
          .from('profiles')
          .update({ email: newEmail })
          .eq('id', user.id);
        
        setUserData({
          ...userData,
          email: newEmail,
        });
        
        setIsEditingEmail(false);
        
        toast({
          title: 'Email Update Initiated',
          description: 'Please check your inbox to confirm your new email address.',
        });
      } catch (error) {
        console.error('Error updating email:', error);
        
        toast({
          title: 'Invalid Email',
          description: 'Failed to update email. Please try again with a valid email address.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle master key update
  const handleMasterKeyChange = async (newKey: string) => {
    setUserData({
      ...userData,
      masterKey: newKey,
    });
    
    if (userScore) {
      const updatedScore = {
        ...userScore,
        masterKey: newKey,
      };
      
      await updateUserScore(updatedScore);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <SlideIn className="mb-8 flex items-center gap-2">
            <Link to="/home" className="flex items-center mr-4">
              <img src="/lovable-uploads/46d3e11e-52ab-4fb5-bfae-9875ba936ab6.png" alt="Reworx" className="h-8" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your account details and preferences
              </p>
            </div>
          </SlideIn>
          
          {/* Profile Information */}
          <FadeIn delay={100} className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="text-primary h-5 w-5" />
                    <Label className="font-medium">Name</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <>
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full sm:w-60"
                        />
                        <Button size="sm" onClick={handleNameUpdate}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 dark:text-gray-300">{userData.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => {
                          setNewName(userData.name);
                          setIsEditingName(true);
                        }}>Edit</Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleCopy(userData.name, 'name')}
                        >
                          {nameCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="text-primary h-5 w-5" />
                    <Label className="font-medium">Email</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditingEmail ? (
                      <>
                        <Input
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full sm:w-60"
                        />
                        <Button size="sm" onClick={handleEmailUpdate}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditingEmail(false)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 dark:text-gray-300">{userData.email}</span>
                        <Button size="sm" variant="ghost" onClick={() => {
                          setNewEmail(userData.email);
                          setIsEditingEmail(true);
                        }}>Edit</Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleCopy(userData.email, 'email')}
                        >
                          {emailCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* Master Key */}
          <FadeIn delay={200} className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Master Key</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm max-w-xs">
                        Your master key is used to verify your trust score with partner companies.
                        Keep it secure and only share it with trusted parties.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <MasterKeyCard 
                masterKey={userData.masterKey} 
                className="mb-4"
                onMasterKeyChange={handleMasterKeyChange}
              />
            </div>
          </FadeIn>
          
          {/* Privacy & Security */}
          <FadeIn delay={300} className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email notifications about your trust score updates
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggleChange('emailNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing Consent</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow us to share your trust score with partner companies
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharingConsent}
                    onCheckedChange={() => handleToggleChange('dataSharingConsent')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={() => handleToggleChange('twoFactorAuth')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-retention">Extended Data Retention</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Keep your order history data for longer than the standard period
                    </p>
                  </div>
                  <Switch
                    id="data-retention"
                    checked={settings.dataRetention}
                    onCheckedChange={() => handleToggleChange('dataRetention')}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
