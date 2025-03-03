
import { Link } from 'react-router-dom';
import { Github, X } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-100 dark:border-gray-800">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/lovable-uploads/4faf26ec-4a33-45c3-a3fe-964fab70e056.png" alt="Reworx" className="w-8 h-8" />
              <span className="font-semibold text-xl tracking-tight">Reworx</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Building trust in e-commerce one purchase at a time. Reworx helps shoppers leverage 
              their shopping habits to gain exclusive benefits while helping businesses enhance user retention.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/integration" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                  Integration
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Reworx. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">X (Twitter)</span>
              <X className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
