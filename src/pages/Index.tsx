import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  MessageSquare, 
  Smartphone, 
  Shield, 
  Clock, 
  Users, 
  Star, 
  CheckCircle,
  QrCode,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Play,
  Pencil,
  Lock
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loadingQRCodes, setLoadingQRCodes] = useState(true);

  const location = useLocation();
  const isAdmin = location.search.includes('admin=1');
  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Page not found</p>
          <a href="/" className="text-[#ff6b00] hover:text-[#ff4d00] underline">Return to Home</a>
        </div>
      </div>
    );
  }

  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(isAdmin);
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const fetchQRCodes = async () => {
      setLoadingQRCodes(true);
      const { data, error } = await supabase.from('qr_codes').select('*').order('created_at', { ascending: false });
      if (!error && data) setQrCodes(data);
      setLoadingQRCodes(false);
    };
    fetchQRCodes();
  }, []);

  const handleAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setAdminAuth(true);
      setShowAdminModal(false);
      setAdminError('');
    } else {
      setAdminError('Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden relative">
      {/* Header */}
      <nav className="relative z-10 border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="font-extrabold text-2xl md:text-3xl tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em' }}>
                  <span className="text-black">QR</span><span className="text-[#ff6b00]">ide</span>
                </span>
              </div>
            </div>
            <h1 className="sr-only">QRide</h1>
            <div className="flex items-center space-x-4">
              {isAdmin && adminAuth && (
                <>
                  <Link 
                    to="/create?admin=1"
                    className="bg-[#ff6b00] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#ff4d00] transition-all duration-300"
                  >
                    Create QR Code
                  </Link>
                  <Link
                    to="/my-qr-codes?admin=1"
                    className="bg-gray-100 text-[#ff6b00] px-6 py-2 rounded-full font-semibold hover:bg-[#ff4d00] hover:text-white transition-all duration-300 ml-2"
                  >
                    My QR Codes
                  </Link>
                </>
              )}
            </div>
            {/* Navigation Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-[#ff6b00] font-semibold transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-[#ff6b00] font-semibold transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('footer')} className="text-gray-700 hover:text-[#ff6b00] font-semibold transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </nav>

      {/* QR Codes Management Section (admin only) */}
      {isAdmin && !adminAuth && (
        <Dialog open={showAdminModal}>
          <DialogContent className="max-w-sm mx-auto p-8 rounded-2xl bg-white border border-gray-200 shadow-xl">
            <DialogHeader className="text-center mb-2">
              <div className="flex flex-col items-center justify-center mb-2">
                <Lock className="w-10 h-10 text-[#ff6b00] mb-2" />
                <DialogTitle className="text-2xl font-bold text-gray-900">Admin Login</DialogTitle>
              </div>
              <p className="text-gray-600 text-base">Enter the admin password to access this page.</p>
            </DialogHeader>
            <form onSubmit={handleAdminPassword} className="space-y-5 mt-4">
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                autoFocus
              />
              {adminError && <div className="text-red-500 text-sm text-center font-medium">{adminError}</div>}
              <button type="submit" className="w-full bg-[#ff6b00] text-white font-bold py-3 rounded-lg text-lg shadow hover:bg-[#ff4d00] transition-all">Continue</button>
            </form>
          </DialogContent>
        </Dialog>
      )}
      {isAdmin && adminAuth && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <QrCode className="w-7 h-7 text-[#ff6b00]" />
            Your QR Codes
          </h2>
          {loadingQRCodes ? (
            <div className="text-gray-600">Loading QR codes...</div>
          ) : qrCodes.length === 0 ? (
            <div className="text-gray-600">No QR codes found. <Link to='/create?admin=1' className='text-[#ff6b00] underline'>Create one</Link>.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {qrCodes.map((qr) => (
                <Card key={qr.id} className="bg-white border-gray-200 rounded-xl shadow-md flex flex-col">
                  <CardContent className="flex-1 flex flex-col gap-3 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-lg text-gray-900 truncate max-w-[70%]">{qr.name}</div>
                      <Link to={`/edit/${qr.id}?admin=1`} className="text-[#ff6b00] hover:text-[#ff4d00]" aria-label="Edit QR Code">
                        <Pencil className="w-5 h-5" />
                      </Link>
                    </div>
                    <div className="text-gray-600 text-xs break-all mb-2">{window.location.origin + '/scan/' + qr.unique_code}</div>
                    <div className="text-gray-600 text-xs">Phone: {qr.phone_number}</div>
                    <div className="text-gray-600 text-xs">Default: {qr.default_message}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
        {/* Absolutely positioned geometric elements, only in hero section */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-24 left-16 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl rotate-12 opacity-20 animate-float"></div>
          <div className="absolute top-40 right-24 w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/2 w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-10 animate-float" style={{ animationDelay: '0.5s', transform: 'translateX(-50%)' }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gray-100 text-[#ff6b00] border-gray-200 text-sm font-medium">
            Revolutionary Car Communication
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up text-gray-900">
            Design that speaks
            <span className="block text-[#ff6b00] italic font-light">
              solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Smart QR code stickers that enable instant communication between drivers. 
            Crafted for the modern world, tailored to your unique needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up">
            <Button size="lg" className="bg-[#ff6b00] text-white hover:bg-orange-500 text-lg px-10 py-4 font-medium">
              Get started →
            </Button>
          </div>

          <div className="text-center text-gray-500 text-sm animate-fade-in-up">
            SCROLL TO EXPLORE
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              The silent problem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every driver faces this. The frustration is real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-200">
                <Car className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Blocked In</h3>
              <p className="text-gray-600 leading-relaxed">
                Someone parked behind you and you can't leave. No way to reach them.
              </p>
            </Card>

            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-200">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Wasted Time</h3>
              <p className="text-gray-600 leading-relaxed">
                Waiting around, honking, or leaving notes that might not be seen.
              </p>
            </Card>

            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-200">
                <MessageSquare className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">No Communication</h3>
              <p className="text-gray-600 leading-relaxed">
                No easy way for drivers to communicate about parking situations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-gray-100">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-[#ff6b00]/10 text-[#ff6b00] border-[#ff6b00]/20">
                The Solution
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                QRide Smart Stickers
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A simple QR code sticker placed on your car window that, when scanned, 
                opens a pre-written message in the scanner's messaging app - ready to send instantly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-[#ff6b00] flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Instant Communication</h4>
                    <p className="text-gray-600">Scan and message in under 5 seconds</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-[#ff6b00] flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Privacy Protected</h4>
                    <p className="text-gray-600">Your contact info stays private until you choose to share</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-[#ff6b00] flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Universal Compatibility</h4>
                    <p className="text-gray-600">Works with WhatsApp, SMS, and all major messaging apps</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 border border-gray-200 backdrop-blur-sm shadow-lg">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">QRide Sticker</h3>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-12 border border-gray-300">
                    <QrCode className="w-32 h-32 mx-auto text-[#ff6b00] mb-6" />
                    <p className="text-sm text-gray-600">Scan to message car owner</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Pre-written message:</p>
                  <p className="font-medium text-gray-900">"Hi! Could you please move your car? I'm blocked in. Thanks!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              How QRide Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and effective communication in just three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#ff6b00]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#ff6b00]/20 group-hover:bg-[#ff6b00]/20 transition-all duration-300">
                <span className="text-3xl font-bold text-[#ff6b00]">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Place Your Sticker</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Stick the QRide QR code on your car window. 
                Weatherproof and designed to last.
              </p>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <Car className="w-16 h-16 mx-auto text-gray-500" />
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-[#ff6b00]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#ff6b00]/20 group-hover:bg-[#ff6b00]/20 transition-all duration-300">
                <span className="text-3xl font-bold text-[#ff6b00]">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Someone Scans</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                When someone needs to reach you, they scan your QR code with their phone camera.
              </p>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <Smartphone className="w-16 h-16 mx-auto text-gray-500" />
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-[#ff6b00]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#ff6b00]/20 group-hover:bg-[#ff6b00]/20 transition-all duration-300">
                <span className="text-3xl font-bold text-[#ff6b00]">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Instant Message</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                A pre-written message opens in their messaging app, ready to send instantly.
              </p>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gray-100 text-gray-600 border-gray-200">
              We specialize in
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Features that matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed with your privacy, convenience, and peace of mind in focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-200">
                <Zap className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Scan and send a message in under 5 seconds. No app downloads required.
              </p>
            </Card>

            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-200">
                <Globe className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Universal</h3>
              <p className="text-gray-600 leading-relaxed">
                Works with any smartphone and messaging app. WhatsApp, SMS, Telegram - you choose.
              </p>
            </Card>

            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-200">
                <Award className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Weatherproof</h3>
              <p className="text-gray-600 leading-relaxed">
                Durable, weather-resistant stickers that last for years without fading.
              </p>
            </Card>

            <Card className="p-8 bg-white border-gray-200 hover:border-[#ff6b00]/30 transition-all duration-300 backdrop-blur-sm shadow-sm">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200">
                <Clock className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Always Available</h3>
              <p className="text-gray-600 leading-relaxed">
                No batteries, no maintenance. Your QRide sticker works 24/7, every day of the year.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section - Official Pricing */}
      <section id="official-pricing" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Official Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent pricing. Activate your QR code for just <span className='text-[#ff6b00] font-bold'>10 EGP/month</span>.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="bg-white border border-[#ff6b00]/30 rounded-3xl shadow-2xl p-10 flex flex-col items-center w-full max-w-md">
              <div className="text-2xl font-semibold text-[#ff6b00] mb-2">Basic</div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2 flex items-end gap-2">
                <span>10</span>
                <span className="text-2xl text-gray-700 font-medium">EGP</span>
                <span className="text-lg text-gray-600 font-normal mb-1">/month</span>
              </div>
              <ul className="mb-8 space-y-3 w-full mt-6">
                <li className="flex items-center gap-3 text-base text-gray-800"><svg className="w-5 h-5 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Activate your QR code instantly</li>
                <li className="flex items-center gap-3 text-base text-gray-800"><svg className="w-5 h-5 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Unlimited scans & contact options</li>
                <li className="flex items-center gap-3 text-base text-gray-800"><svg className="w-5 h-5 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Secure & private communication</li>
                <li className="flex items-center gap-3 text-base text-gray-800"><svg className="w-5 h-5 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Cancel anytime</li>
                <li className="flex items-center gap-3 text-base text-gray-800"><svg className="w-5 h-5 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Priority support</li>
              </ul>
              <a href="/subscribe/demo" className="w-full">
                <button className="w-full bg-[#ff6b00] text-white hover:bg-[#ff4d00] font-bold text-lg py-4 rounded-xl shadow-xl transition-all duration-200 mb-2">
                  Subscribe Now
                </button>
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-2">
                <svg className="w-4 h-4 text-[#ff6b00]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11V17M12 7V7.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                Secure payment via Paymob
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Update with link to create page */}
      <section id="pricing" className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to Transform Your Car Communication?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of drivers already using QRide smart stickers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <button className="bg-[#ff6b00] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#ff4d00] transition-all duration-300 hover:scale-105">
                  Get Your QR Sticker
                </button>
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="w-full bg-white border-t border-gray-200 mt-12 py-12 px-4 text-gray-700 text-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 items-start">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-lg text-gray-900 mb-2">Legal</span>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms and Conditions</a>
            <a href="#refund" className="hover:underline">Refund & Exchange Policy</a>
            <a href="#service-duration" className="hover:underline">Service Duration Policy</a>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <span className="font-bold text-lg text-gray-900 mb-2">Contact Us</span>
            <span>Phone: <a href="tel:+201234567890" className="hover:underline">+20 123 456 7890</a></span>
            <span>Email: <a href="mailto:info@qride.com" className="hover:underline">info@qride.com</a></span>
            <span>Address: Cairo, Egypt</span>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-400 text-xs">&copy; {new Date().getFullYear()} QRide. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Index;
