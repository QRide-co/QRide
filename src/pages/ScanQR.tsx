import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Info, ArrowLeft, Phone, MessageSquare, Smartphone, CheckCircle } from 'lucide-react';

interface QRCodeData {
  id: string;
  name: string;
  phone_number: string;
  default_message: string;
  activated: boolean;
  unique_code: string;
  package: string;
}

const ScanQR = () => {
  const { code } = useParams<{ code: string }>();
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Add state for selected message
  const messageChoices = [
    '🛑 Please move your car 🛑',
    '🛑 من فضلك حرك سيارتك 🛑'
  ];
  const [selectedMessage, setSelectedMessage] = useState(messageChoices[0]);

  const [isSending, setIsSending] = useState(false);
  const [relaySuccess, setRelaySuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const SECRET = 'changeme'; // Should match your backend secret

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
    const message = encodeURIComponent(selectedMessage);
    const smsUrl = `sms:${qrData.phone_number}?body=${message}`;
    window.location.href = smsUrl;
    toast({
      title: "Opening SMS App",
      description: "Your default messaging app should open now",
    });
  };

  const handleSendWhatsApp = () => {
    if (!qrData) return;
    const message = encodeURIComponent(selectedMessage);
    const whatsappUrl = `https://wa.me/${qrData.phone_number}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    if (!qrData) return;
    window.location.href = `tel:${qrData.phone_number}`;
  };

  const handleSendRelaySMS = async () => {
    if (!qrData) return;
    setIsSending(true);
    setRelaySuccess(false);
    try {
      await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: qrData.unique_code, message: selectedMessage }),
      });
      toast({
        title: 'Sending...'
      });
      // Start polling for message delivery confirmation
      pollForMessageDelivery();
    } catch (e) {
      setIsSending(false);
      toast({
        title: 'Error',
        description: 'Failed to queue SMS. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Polling function for message delivery
  const pollForMessageDelivery = () => {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
      attempts++;
      // Poll delivery_status table for confirmation
      const res = await fetch(`https://uipodeoczfvqikkxvgsq.supabase.co/rest/v1/delivery_status?code=eq.${qrData.unique_code}&message=eq.${encodeURIComponent(selectedMessage)}`, {
        headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcG9kZW9jemZ2cWlra3h2Z3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzk1MTYsImV4cCI6MjA2NjYxNTUxNn0.Sgcx8LM4DvJIWxWZbxePLCdeMHmGwZgXfqHycuuMhMY' }
      });
      const data = await res.json();
      const found = data && data.find((m: any) => m.status === 'sent');
      if (found) {
        clearInterval(interval);
        setIsSending(false);
        setRelaySuccess(true);
        setShowSuccessPopup(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setIsSending(false);
        toast({
          title: 'Timeout',
          description: 'Message delivery could not be confirmed.',
          variant: 'destructive',
        });
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading QR code data...</p>
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
                  <Button className="w-full bg-[#ff6b00] text-black hover:bg-[#ff5a00] font-semibold">
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
                className="w-full bg-[#ff6b00] text-black hover:bg-[#ff5a00] font-semibold py-4 text-lg rounded-lg shadow-md"
                onClick={() => window.location.href = `/subscribe/${qrData.unique_code}`}
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900 flex flex-col">
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-400 p-8 max-w-sm w-full flex flex-col items-center animate-fade-in">
            <CheckCircle className="w-14 h-14 text-orange-500 mb-4" />
            <div className="text-2xl font-bold text-orange-600 mb-2">Message Delivered!</div>
            <div className="text-gray-700 text-lg mb-4 text-center">Your message was sent successfully.</div>
            <button
              className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold shadow hover:bg-orange-600 transition"
              onClick={() => setShowSuccessPopup(false)}
              autoFocus
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <Card className="bg-white border border-gray-200 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Contact Vehicle Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mb-6 w-full px-2">
                <div className="text-center text-gray-600 text-base mb-2">Choose a message to send:</div>
                <div className="flex flex-wrap gap-4 justify-center w-full max-w-full">
                  {messageChoices.map(msg => (
                    <Button
                      key={msg}
                      type="button"
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full max-w-xs px-4 py-2 rounded-lg font-semibold border transition-colors ${selectedMessage === msg ? 'bg-[#ff6b00] text-white' : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'}`}
                      aria-pressed={selectedMessage === msg}
                    >
                      {msg}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="text-center text-gray-600 text-base mb-2">
                Choose how you'd like to contact:
              </div>
              <div className="flex flex-col gap-4">
                {qrData.package === 'advanced' ? (
                  <Button
                    onClick={handleSendRelaySMS}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    aria-label="Send SMS Message"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5 mr-3" />
                        SMS (Private)
                      </>
                    )}
                  </Button>
                ) : (
                  <>
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
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      aria-label="Send SMS Message"
                    >
                      <Smartphone className="w-5 h-5 mr-3" />
                      SMS
                    </Button>
                    <Button
                      onClick={handleCall}
                      className="w-full bg-green-400 text-white hover:bg-green-500 font-semibold py-6 flex items-center justify-center text-lg rounded-lg shadow-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                      aria-label="Call"
                    >
                      <Phone className="w-5 h-5 mr-3" />
                      Call
                    </Button>
                  </>
                )}
              </div>
              <Button
                asChild
                className="w-full border-2 border-[#ff6b00] text-[#ff6b00] hover:bg-orange-50 font-semibold py-2 text-base rounded-md mt-4"
              >
                <Link to={`/edit/${qrData.id}`}>Edit QR Code</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Join QRide button fixed at bottom center */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 text-lg transition-all">
          <svg className="w-6 h-6" fill="none" stroke="#204080" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Join QRide
        </Link>
      </div>
    </div>
  );
};

export default ScanQR;
