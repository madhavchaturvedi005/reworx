
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createNewMasterKey } from '@/utils/trustScore';
import { Check, RefreshCw, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

interface MasterKeyCardProps {
  masterKey?: string;
  className?: string;
}

const MasterKeyCard = ({ masterKey: initialMasterKey, className }: MasterKeyCardProps) => {
  const [masterKey, setMasterKey] = useState(initialMasterKey || '');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();
  
  // Handle generate/regenerate master key
  const handleGenerateKey = () => {
    setIsRegenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey = createNewMasterKey();
      setMasterKey(newKey);
      setIsRevealed(true);
      setIsRegenerating(false);
      
      toast({
        title: 'Master Key Updated',
        description: 'Your master key has been successfully updated.',
      });
    }, 1200);
  };
  
  // Handle copying master key to clipboard
  const handleCopyKey = () => {
    if (!masterKey) return;
    
    navigator.clipboard.writeText(masterKey);
    setIsCopied(true);
    
    toast({
      title: 'Copied to Clipboard',
      description: 'Your master key has been copied to the clipboard.',
    });
    
    // Reset copy state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Format the master key display
  const formatMasterKey = () => {
    if (!masterKey) return '';
    
    if (isRevealed) {
      return masterKey;
    }
    
    // Hide the key with bullets
    return masterKey.replace(/[A-Z0-9]/g, '•');
  };
  
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl glass-card overflow-hidden scale-on-hover",
        className
      )}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Master Key
          </h3>
          {masterKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevealed(!isRevealed)}
              className="text-xs h-7 px-2 border-gray-200 dark:border-gray-700"
            >
              {isRevealed ? 'Hide' : 'Reveal'}
            </Button>
          )}
        </div>
        
        {masterKey ? (
          <>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center mb-4 font-mono text-lg tracking-wider">
              {formatMasterKey()}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleCopyKey}
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleGenerateKey}
                disabled={isRegenerating}
              >
                <RefreshCw className={cn("w-4 h-4", isRegenerating && "animate-spin")} />
                <span>Regenerate</span>
              </Button>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Share this key with partner companies to verify your trust score.
              Regenerating will invalidate your previous key.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You need a trust score of at least 40 to generate a master key. 
              Connect more platforms and improve your score.
            </p>
            
            <Button
              onClick={handleGenerateKey}
              disabled={isRegenerating}
              className="flex items-center gap-2"
            >
              {isRegenerating && <RefreshCw className="w-4 h-4 animate-spin" />}
              Generate Master Key
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterKeyCard;
