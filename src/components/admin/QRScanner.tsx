import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { QrCode, Camera, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (barcode: string) => void;
}

export const QRScanner = ({ onScan }: QRScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>('qr-scanner-container');

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      const scanner = new Html5Qrcode(containerRef.current);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          toast({
            title: 'Barcode Scanned',
            description: `Code: ${decodedText}`,
          });
          stopScanner();
          setIsOpen(false);
        },
        () => {} // Ignore failures
      );

      setIsScanning(true);
    } catch (error: any) {
      console.error('Scanner error:', error);
      toast({
        title: 'Scanner Error',
        description: error.message || 'Failed to start camera',
        variant: 'destructive',
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING state
          await scannerRef.current.stop();
        }
      } catch (error) {
        console.log('Scanner already stopped');
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      stopScanner();
    }
    setIsOpen(open);
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        <QrCode className="w-4 h-4 mr-2" />
        Scan QR/Barcode
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Scan Product Barcode
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-4">
              <div
                id={containerRef.current}
                className="w-full aspect-square bg-muted rounded-lg overflow-hidden"
              />
            </Card>

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanner} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopScanner} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Point your camera at a product barcode or QR code to scan it.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
