import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Lock, Shield, Zap, HelpCircle } from 'lucide-react';

const features = [
  'Activate your QR code instantly',
  'Unlimited scans & contact options',
  'Secure & private communication',
  'Cancel anytime',
  'Priority support',
];

const faqs = [
  {
    q: 'What happens after I subscribe?',
    a: 'Your QR code is activated instantly and all contact features are enabled.'
  },
  {
    q: 'Is my payment secure?',
    a: 'Yes, all payments are processed securely via Paymob.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel your subscription at any time from your dashboard.'
  },
];

const Subscribe = () => {
  const { code } = useParams<{ code: string }>();
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data } = await supabase.from('qr_codes').select('*').eq('unique_code', code).single();
      setQrData(data);
      setLoading(false);
    })();
  }, [code]);

  const handleSubscribe = async () => {
    if (!code) return;
    // Instantly activate the QR code (simulate payment success)
    await supabase.from('qr_codes').update({ activated: true }).eq('unique_code', code);
    setQrData((prev: any) => ({ ...prev, activated: true }));
    alert('Subscription successful! Your QR code is now activated.');
    // Optionally, redirect or update UI
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-900 bg-gray-50">Loading...</div>;
  }

  if (!qrData) {
    return <div className="min-h-screen flex items-center justify-center text-gray-900 bg-gray-50">QR code not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 text-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-white border-gray-200 shadow-2xl rounded-3xl p-8">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-4xl font-bold mb-2 text-gray-900">Unlock All Features</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              Subscribe to activate your QR code and enable instant contact.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Pricing Card */}
            <div className="flex-1 bg-gradient-to-br from-[#ff6b00]/10 to-gray-50 rounded-2xl p-8 border border-[#ff6b00]/30 shadow-lg flex flex-col items-center">
              <div className="text-2xl font-semibold text-[#ff6b00] mb-2">Basic</div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2 flex items-end gap-2">
                <span>10</span>
                <span className="text-2xl text-gray-700 font-medium">EGP</span>
                <span className="text-lg text-gray-600 font-normal mb-1">/month</span>
              </div>
              <div className="text-gray-600 mb-6 text-center">Perfect for individuals who want to enable their QR code for full contact features.</div>
              <ul className="mb-8 space-y-3 w-full">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-base text-gray-800">
                    <CheckCircle className="w-5 h-5 text-[#ff6b00]" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-[#ff6b00] text-white hover:bg-[#ff5a00] font-bold text-lg py-4 rounded-xl shadow-xl transition-all duration-200 mb-2"
                size="lg"
                onClick={handleSubscribe}
              >
                Subscribe with Paymob
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-2">
                <Lock className="w-4 h-4 text-[#ff6b00]" /> Secure payment via Paymob
              </div>
            </div>
            {/* QR Code Details */}
            <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow flex flex-col items-center">
              <div className="text-lg font-semibold mb-2 text-gray-900">Your QR Code</div>
              <div className="bg-white p-3 rounded-lg mb-4 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + '/scan/' + qrData.unique_code)}`}
                  alt="QR Code"
                  className="w-36 h-36"
                />
              </div>
              <div className="text-sm text-gray-700 mb-1"><b>Name:</b> {qrData.name}</div>
              <div className="text-sm text-gray-700 mb-1"><b>Phone:</b> {qrData.phone_number}</div>
              <div className="text-sm text-gray-700 mb-1"><b>Default Message:</b> {qrData.default_message}</div>
              <div className="text-xs text-gray-500 break-all"><b>Scan URL:</b> {window.location.origin + '/scan/' + qrData.unique_code}</div>
            </div>
          </CardContent>
        </Card>
        {/* FAQ / Benefits Section */}
        <div className="max-w-2xl mx-auto mt-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-[#ff6b00]" />
            <span className="text-xl font-bold text-gray-900">Frequently Asked Questions</span>
          </div>
          <ul className="space-y-6">
            {faqs.map((faq, i) => (
              <li key={i}>
                <div className="font-semibold text-gray-900 mb-1">{faq.q}</div>
                <div className="text-gray-700 text-base">{faq.a}</div>
              </li>
            ))}
          </ul>
        </div>
        {/* Trust signals */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-10 text-gray-600 text-sm">
          <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-[#ff6b00]" /> 100% Secure Payment</div>
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-[#ff6b00]" /> Instant Activation</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#ff6b00]" /> Money-back Guarantee</div>
        </div>
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
