import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Lock, Shield, Zap, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const features = [
  'Activate your QR code instantly',
  'Unlimited scans & contact options',
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
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data } = await supabase.from('qr_codes').select('*').eq('unique_code', code).single();
      setQrData(data);
      setLoading(false);
    })();
  }, [code]);

  const handleSubscribe = async (pkg: 'basic' | 'advanced') => {
    if (!code) return;
    const { data } = await supabase.from('qr_codes').update({ activated: true, package: pkg }).eq('unique_code', code).select();
    setQrData((prev: any) => ({ ...prev, activated: true, package: pkg }));
    setShowSuccess(true);
    setTimeout(() => {
      if (data && data[0] && data[0].id) {
        navigate(`/edit/${data[0].id}`);
      }
    }, 1500);
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
            {/* Basic Package Card */}
            <div className="flex-1 bg-gradient-to-br from-[#ff6b00]/10 to-gray-50 rounded-2xl p-8 border border-[#ff6b00]/30 shadow-lg flex flex-col items-center">
              <div className="text-2xl font-semibold text-[#ff6b00] mb-2">Basic</div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2 flex items-end gap-2">
                <span>10</span>
                <span className="text-2xl text-gray-700 font-medium">EGP</span>
                <span className="text-lg text-gray-600 font-normal mb-1">/month</span>
              </div>
              <div className="text-gray-600 mb-6 text-center">All contact options</div>
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
                onClick={() => handleSubscribe('basic')}
              >
                Subscribe with Paymob
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-2">
                <Lock className="w-4 h-4 text-[#ff6b00]" /> Secure payment via Paymob
              </div>
            </div>
            {/* Advanced Package Card */}
            <div className="flex-1 bg-orange-50 rounded-2xl p-8 border border-orange-300 shadow-lg flex flex-col items-center">
              <div className="text-2xl font-semibold text-orange-600 mb-2">Advanced</div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2 flex items-end gap-2">
                <span>20</span>
                <span className="text-2xl text-gray-700 font-medium">EGP</span>
                <span className="text-lg text-gray-600 font-normal mb-1">/month</span>
              </div>
              <div className="text-gray-600 mb-6 text-center">For privacy-focused users. Only SMS relay is enabled; your phone number is never shown.</div>
              <ul className="mb-8 space-y-3 w-full">
                <li className="flex items-center gap-3 text-base text-gray-800">
                  <CheckCircle className="w-5 h-5 text-orange-600" /> SMS relay only (privacy enhanced)
                </li>
              </ul>
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg py-4 rounded-xl shadow-xl transition-all duration-200 mb-2"
                size="lg"
                onClick={() => handleSubscribe('advanced')}
              >
                Subscribe with Paymob
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-2">
                <Lock className="w-4 h-4 text-orange-600" /> Secure payment via Paymob
              </div>
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
      {/* Success Dialog */}
      <Dialog open={showSuccess}>
        <DialogContent className="max-w-sm mx-auto p-8 rounded-2xl bg-white border border-gray-200 shadow-xl text-center">
          <DialogHeader>
            <DialogTitle className="text-green-600 text-2xl font-bold">Subscription Successful!</DialogTitle>
          </DialogHeader>
          <div className="text-gray-700 text-lg mt-2 mb-4">Your QR code is now activated. Redirecting...</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscribe;
