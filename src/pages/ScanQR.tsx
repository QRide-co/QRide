import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Info, ArrowLeft, Phone, MessageSquare, Smartphone } from 'lucide-react';

interface QRCodeData {
  id: string;
  name: string;
  phone_number: string;
  default_message: string;
  activated: boolean;
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
          setQrData(data as any);
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

  const handleSendWhatsApp = () => {
    if (!qrData) return;
    const message = encodeURIComponent(qrData.default_message);
    const whatsappUrl = `https://wa.me/${qrData.phone_number}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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

  if (!qrData.activated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <Card className="bg-gray-900/70 border-gray-800 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl font-bold">QR Code Not Activated</CardTitle>
              <CardDescription className="text-gray-400 text-lg mt-1">
                This QR code is not yet active. Please activate it to enable contact options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold py-4 text-lg rounded-lg shadow-md"
                onClick={() => window.location.href = '/subscribe'}
              >
                Activate QR Code
              </Button>
              <div className="text-center text-gray-400 text-sm mt-4">
                Already subscribed? Please refresh this page after activation.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
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

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <Card className="bg-gray-900/70 border-gray-800 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl font-bold">Contact Vehicle Owner</CardTitle>
              <CardDescription className="text-gray-400 text-lg mt-1">{qrData.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-gray-300 text-base mb-2">
                Choose how you'd like to contact:
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57] font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-[#25D366] focus:outline-none"
                  aria-label="Send WhatsApp Message"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-[#9cff1e] focus:outline-none"
                  aria-label="Send SMS Message"
                >
                  <Smartphone className="w-5 h-5 mr-3" />
                  SMS
                </Button>
                <Button
                  onClick={handleCall}
                  className="w-full border-gray-700 text-white hover:bg-gray-800 py-6 flex items-center justify-center text-lg rounded-lg focus:ring-2 focus:ring-gray-700 focus:outline-none"
                  aria-label="Call Now"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call
                </Button>
                <Link to={`/edit/${qrData.id}`} state={{ fromScan: true }} className="w-full block mt-2">
                  <Button className="w-full bg-gray-800 text-[#9cff1e] hover:bg-gray-900 hover:text-white font-semibold py-4 flex items-center justify-center text-base rounded-lg border border-[#9cff1e] focus:ring-2 focus:ring-[#9cff1e] focus:outline-none" aria-label="Edit QR Code">
                    Edit QR Code
                  </Button>
                </Link>
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
