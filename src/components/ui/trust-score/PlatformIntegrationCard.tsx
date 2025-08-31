import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/utils/trustScore";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PlatformIntegrationCardProps {
  platform: Platform;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
}

const PlatformIntegrationCard = ({ 
  platform, 
  onConnect, 
  onDisconnect 
}: PlatformIntegrationCardProps) => {
  const getStatusIcon = () => {
    switch (platform.status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (platform.status) {
      case 'active':
        return <Badge variant="default">Connected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Not Connected</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full p-1 flex-shrink-0 overflow-hidden shadow-sm">
              <img 
                src={`/lovable-uploads/${platform.icon}.png`} 
                alt={platform.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-semibold">{platform.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {platform.description}
        </p>
        
        {platform.isConnected ? (
          <div className="space-y-3">
            {platform.orderCount && (
              <div className="flex justify-between text-sm">
                <span>Orders:</span>
                <span className="font-medium">{platform.orderCount}</span>
              </div>
            )}
            {platform.totalSpent && (
              <div className="flex justify-between text-sm">
                <span>Total Spent:</span>
                <span className="font-medium">₹{platform.totalSpent.toLocaleString()}</span>
              </div>
            )}
            {platform.lastOrderDate && (
              <div className="flex justify-between text-sm">
                <span>Last Order:</span>
                <span className="font-medium">
                  {new Date(platform.lastOrderDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDisconnect?.(platform.id)}
              className="w-full mt-4"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => onConnect?.(platform.id)}
            className="w-full"
            disabled={platform.status === 'pending'}
          >
            {platform.status === 'pending' ? 'Connecting...' : 'Connect Platform'}
          </Button>
        )}
        
        {platform.error && (
          <p className="text-xs text-red-500 mt-2">{platform.error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformIntegrationCard;