
import { Home, LayoutDashboard, Link2, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BottomNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Integration', path: '/integration', icon: Link2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-black/50 backdrop-blur-md border-t">
      <div className="h-full max-w-md mx-auto px-4 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors',
                location.pathname === item.path 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
