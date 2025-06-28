import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Subscribe = () => {
  const { code } = useParams<{ code: string }>();
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data, error } = await supabase.from('qr_codes').select('*').eq('unique_code', code).single();
      setQrData(data);
      setLoading(false);
    })();
  }, [code]);

  const handleSubscribe = () => {
    // Integrate Paymob here
    alert('Redirecting to Paymob payment... (placeholder)');
    // After successful payment, activate QR code and redirect
    // await supabase.from('qr_codes').update({ activated: true }).eq('unique_code', code);
    // navigate(`/scan/${code}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!qrData) {
    return <div className="min-h-screen flex items-center justify-center text-white">QR code not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <Card className="bg-gray-900/70 border-gray-800 shadow-xl rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl font-bold">Subscribe to Activate</CardTitle>
            <CardDescription className="text-gray-400 text-lg mt-1">
              <div className="mb-2">Basic Package: <span className="text-[#9cff1e]">10 EGP/month</span></div>
              <div className="text-base text-white mt-4">QR Code Details:</div>
              <ul className="text-sm text-gray-300 mt-2 text-left">
                <li><b>Name:</b> {qrData.name}</li>
                <li><b>Phone:</b> {qrData.phone_number}</li>
                <li><b>Default Message:</b> {qrData.default_message}</li>
                <li><b>Scan URL:</b> {window.location.origin + '/scan/' + qrData.unique_code}</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold py-4 text-lg rounded-lg shadow-md" onClick={handleSubscribe}>
              Subscribe with Paymob
            </Button>
            <Link to="/">
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe; 