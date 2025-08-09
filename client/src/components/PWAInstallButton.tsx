import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useToast } from '@/hooks/use-toast';

export function PWAInstallButton() {
  const { canInstall, installPWA, isStandalone } = usePWA();
  const { toast } = useToast();

  const handleInstallClick = async () => {
    const success = await installPWA();
    
    if (success) {
      toast({
        title: "App Installing",
        description: "Mentally Chill is being added to your home screen!",
        duration: 3000,
      });
    }
  };

  // Show install prompt for iOS users
  const showIOSInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isStandalone) {
      toast({
        title: "Install on iOS",
        description: "Tap the Share button and select 'Add to Home Screen'",
        duration: 5000,
      });
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {canInstall ? (
        <Button
          id="install-button"
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white shadow-lg animate-pulse md:relative md:bottom-auto md:right-auto md:animate-none"
          data-testid="button-install-pwa"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </Button>
      ) : /iPad|iPhone|iPod/.test(navigator.userAgent) ? (
        <Button
          onClick={showIOSInstructions}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white shadow-lg md:relative md:bottom-auto md:right-auto"
          data-testid="button-ios-install"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add to Home Screen</span>
          <span className="sm:hidden">Add</span>
        </Button>
      ) : null}
    </>
  );
}