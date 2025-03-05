
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, PlusCircle } from 'lucide-react';
import PlatformRequestForm from './PlatformRequestForm';

const CustomConnectPlatformsCard = () => {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Connect Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs font-medium">A</span>
                </div>
                <div>
                  <p className="font-medium">Amazon</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-xs font-medium">F</span>
                </div>
                <div>
                  <p className="font-medium">Flipkart</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-xs font-medium">M</span>
                </div>
                <div>
                  <p className="font-medium">Myntra</p>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button onClick={() => navigate('/integration')} className="w-full" variant="outline">
            <LinkIcon className="mr-2 h-4 w-4" />
            Connect More
          </Button>
          <Button onClick={() => setFormOpen(true)} className="w-full" variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" />
            Request Platform
          </Button>
        </CardFooter>
      </Card>
      
      <PlatformRequestForm open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
};

export default CustomConnectPlatformsCard;
