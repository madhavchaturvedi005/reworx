
import { useNavigate } from 'react-router-dom';
import { Link, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { availablePlatforms } from '@/utils/trustScore';

const ConnectPlatformsCard = () => {
  const navigate = useNavigate();
  
  // Get connected and unconnected platforms
  const connectedPlatforms = availablePlatforms.filter(platform => platform.isConnected);
  const unconnectedPlatforms = availablePlatforms.filter(platform => !platform.isConnected);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          Connected Platforms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectedPlatforms.length > 0 ? (
            <div className="space-y-3">
              {connectedPlatforms.map((platform) => (
                <div key={platform.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full p-1 flex-shrink-0 overflow-hidden shadow-sm">
                    <img 
                      src={`/lovable-uploads/${platform.icon}.png`} 
                      alt={platform.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    {platform.lastSync && (
                      <p className="text-xs text-muted-foreground">
                        Last synced: {new Date(platform.lastSync).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-muted-foreground text-sm">No platforms connected yet.</p>
            </div>
          )}
          
          {unconnectedPlatforms.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Available Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {unconnectedPlatforms.slice(0, 3).map((platform) => (
                  <div 
                    key={platform.id} 
                    className="w-8 h-8 bg-white rounded-full p-1 flex-shrink-0 overflow-hidden shadow-sm opacity-60"
                  >
                    <img 
                      src={`/lovable-uploads/${platform.icon}.png`} 
                      alt={platform.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
                {unconnectedPlatforms.length > 3 && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium">
                    +{unconnectedPlatforms.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/integration')}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect More Platforms
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectPlatformsCard;
