
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Info, ArrowLeft, Phone } from 'lucide-react';

interface QRCodeData {
  id: string;
  name: string;
  phone_number: string;
  default_message: string;
}

const ScanQR = () => {
  const { code } = useParams<{ code: string }>();
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQRData = async () => {
      if (!code) {
        setError('Invalid QR code');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('unique_code', code)
          .single();

        if (error) throw error;

        if (!data) {
          setError('QR code not found');
        } else {
          setQrData(data);
        }
      } catch (error) {
        console.error('Error fetching QR data:', error);
        setError('Failed to load QR code data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRData();
  }, [code]);

  const handleSendMessage = () => {
    if (!qrData) return;

    // Create SMS link that works offline
    const message = encodeURIComponent(qrData.default_message);
    const smsUrl = `sms:${qrData.phone_number}?body=${message}`;
    
    // Try to open SMS app
    window.location.href = smsUrl;
    
    toast({
      title: "Opening SMS App",
      description: "Your default messaging app should open now",
    });
  };

  const handleKnowMore = () => {
    // Redirect to main website
    window.location.href = '/';
  };

  const handleCall = () => {
    if (!qrData) return;
    window.location.href = `tel:${qrData.phone_number}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9cff1e] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading QR code data...</p>
        </div>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-400">QR Code Not Found</CardTitle>
                <CardDescription className="text-gray-400">
                  {error || 'This QR code is invalid or has expired'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/">
                  <Button className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to QRide Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 backdrop-blur-sm bg-black/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[#9cff1e] hover:text-[#8ae619] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              QRide
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Vehicle Contact</CardTitle>
              <CardDescription className="text-gray-400">
                {qrData.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-300 mb-6">
                Choose how you'd like to contact the vehicle owner:
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold py-6"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Send Message
                  <span className="text-xs ml-2 opacity-70">(Works Offline)</span>
                </Button>

                <Button
                  onClick={handleCall}
                  variant="outline"
                  className="w-full border-gray-700 text-white hover:bg-gray-800 py-6"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call Now
                </Button>

                <Button
                  onClick={handleKnowMore}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800 py-6"
                >
                  <Info className="w-5 h-5 mr-3" />
                  Learn More About QRide
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                  Default message: "{qrData.default_message}"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
