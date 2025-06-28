
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
  unique_code: string;
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

  const handleKnowMore = () => {
    window.open('/', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR code data...</p>
        </div>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-600">QR Code Not Found</CardTitle>
                <CardDescription className="text-gray-600">
                  {error || 'This QR code is invalid or has expired'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/">
                  <Button className="w-full bg-[#ff6b00] text-white hover:bg-[#ff5a00] font-semibold">
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[#ff6b00] hover:text-[#ff5a00] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              QRide
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <Card className="bg-white border-gray-200 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-900 text-2xl font-bold">Contact Vehicle Owner</CardTitle>
              <CardDescription className="text-gray-600 text-lg mt-1">{qrData.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-gray-700 text-base mb-2">
                Choose how you'd like to contact:
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-[#ff6b00] text-white hover:bg-[#ff5a00] font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-[#ff6b00] focus:outline-none"
                  aria-label="Send SMS Message"
                >
                  <Smartphone className="w-5 h-5 mr-3" />
                  Send Message (SMS)
                </Button>
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57] font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-[#25D366] focus:outline-none"
                  aria-label="Send WhatsApp Message"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleCall}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-6 flex items-center justify-center text-lg rounded-lg focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  variant="outline"
                  aria-label="Call Now"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call
                </Button>
                <Button
                  onClick={handleKnowMore}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-4 flex items-center justify-center text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  aria-label="Know More about QRide"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Know More about QRide
                </Button>
                <Link to={`/edit/${qrData.id}`} state={{ fromScan: true }} className="w-full block mt-2">
                  <Button className="w-full bg-gray-100 text-[#ff6b00] hover:bg-gray-200 hover:text-[#ff5a00] font-semibold py-4 flex items-center justify-center text-base rounded-lg border border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00] focus:outline-none" aria-label="Edit QR Code">
                    Edit QR Code
                  </Button>
                </Link>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
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
