
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, Link2, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Handle scroll detection for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation items with icons
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Integration', path: '/integration', icon: <Link2 className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];
  
  // Handle logout
  const handleLogout = () => {
    logout();
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    
    navigate('/login');
  };
  
  const getUserInitials = () => {
    if (!user) return 'U';
    
    // Get the first part of the email (before @)
    const name = user.email.split('@')[0];
    
    // If name contains dots or underscores, treat them as spaces
    const parts = name.replace(/[._]/g, ' ').split(' ');
    
    if (parts.length > 1) {
      // Get first letter of first and last part
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    
    // Just get the first letter or use first two letters
    return (name.length > 1 ? name.substring(0, 2) : name + 'U').toUpperCase();
  };
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 backdrop-blur-md',
        isScrolled ? 'bg-white/70 dark:bg-black/50 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80"
        >
          <img src="/lovable-uploads/4faf26ec-4a33-45c3-a3fe-964fab70e056.png" alt="Reworx" className="w-8 h-8" />
          <span className="font-semibold text-xl tracking-tight">Reworx</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {isAuthenticated && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all',
                location.pathname === item.path 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-2" aria-label="User menu">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>My Account</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all bg-primary text-white hover:bg-primary/90"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
        </nav>
        
        <div className="flex md:hidden">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>My Account</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/integration')}>
                  <Link2 className="mr-2 h-4 w-4" />
                  <span>Integration</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-full flex items-center justify-center bg-primary text-white"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
