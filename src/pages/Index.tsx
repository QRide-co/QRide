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
  Pencil
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loadingQRCodes, setLoadingQRCodes] = useState(true);

  useEffect(() => {
    const fetchQRCodes = async () => {
      setLoadingQRCodes(true);
      const { data, error } = await supabase.from('qr_codes').select('*').order('created_at', { ascending: false });
      if (!error && data) setQrCodes(data);
      setLoadingQRCodes(false);
    };
    fetchQRCodes();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Floating geometric elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl rotate-12 opacity-60 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-gray-900 to-black rounded-2xl rotate-45 opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full opacity-30 animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-sm bg-black/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#9cff1e] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">QR</span>
              </div>
              <h1 className="text-xl font-bold">QRide</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/create"
                className="bg-[#9cff1e] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#8ae619] transition-all duration-300"
              >
                Create QR Code
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* QR Codes Management Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <QrCode className="w-7 h-7 text-[#9cff1e]" />
          Your QR Codes
        </h2>
        {loadingQRCodes ? (
          <div className="text-gray-400">Loading QR codes...</div>
        ) : qrCodes.length === 0 ? (
          <div className="text-gray-400">No QR codes found. <Link to='/create' className='text-[#9cff1e] underline'>Create one</Link>.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <Card key={qr.id} className="bg-gray-900/70 border-gray-800 rounded-xl shadow-md flex flex-col">
                <CardContent className="flex-1 flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-lg text-white truncate max-w-[70%]">{qr.name}</div>
                    <Link to={`/edit/${qr.id}`} className="text-[#9cff1e] hover:text-[#8ae619]" aria-label="Edit QR Code">
                      <Pencil className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className="text-gray-400 text-xs break-all mb-2">{window.location.origin + '/scan/' + qr.unique_code}</div>
                  <div className="text-gray-400 text-xs">Phone: {qr.phone_number}</div>
                  <div className="text-gray-400 text-xs">Default: {qr.default_message}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-gray-900 text-[#9cff1e] border-gray-800 text-sm font-medium">
            Revolutionary Car Communication
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
            Design that speaks
            <span className="block text-[#9cff1e] italic font-light">
              solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Smart QR code stickers that enable instant communication between drivers. 
            Crafted for the modern world, tailored to your unique needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up">
            <Button size="lg" className="bg-[#9cff1e] text-black hover:bg-lime-400 text-lg px-10 py-4 font-medium">
              Get started →
            </Button>
          </div>

          <div className="text-center text-gray-500 text-sm animate-fade-in-up">
            SCROLL TO EXPLORE
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              The silent problem
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every driver faces this. The frustration is real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <Car className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Blocked In</h3>
              <p className="text-gray-400 leading-relaxed">
                Someone parked behind you and you can't leave. No way to reach them.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Wasted Time</h3>
              <p className="text-gray-400 leading-relaxed">
                Waiting around, honking, or leaving notes that might not be seen.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                <MessageSquare className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">No Communication</h3>
              <p className="text-gray-400 leading-relaxed">
                No easy way for drivers to communicate about parking situations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-[#9cff1e]/10 text-[#9cff1e] border-[#9cff1e]/20">
                The Solution
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                QRide Smart Stickers
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                A simple QR code sticker placed on your car window that, when scanned, 
                opens a pre-written message in the scanner's messaging app - ready to send instantly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-[#9cff1e] flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Instant Communication</h4>
                    <p className="text-gray-400">Scan and message in under 5 seconds</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-[#9cff1e] flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Privacy Protected</h4>
                    <p className="text-gray-400">Your contact info stays private until you choose to share</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-[#9cff1e] flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Universal Compatibility</h4>
                    <p className="text-gray-400">Works with WhatsApp, SMS, and all major messaging apps</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-900/50 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-white">QRide Sticker</h3>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700">
                    <QrCode className="w-32 h-32 mx-auto text-[#9cff1e] mb-6" />
                    <p className="text-sm text-gray-400">Scan to message car owner</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">Pre-written message:</p>
                  <p className="font-medium text-white">"Hi! Could you please move your car? I'm blocked in. Thanks!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How QRide Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple, secure, and effective communication in just three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#9cff1e]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#9cff1e]/20 group-hover:bg-[#9cff1e]/20 transition-all duration-300">
                <span className="text-3xl font-bold text-[#9cff1e]">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Place Your Sticker</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Stick the QRide QR code on your car window. 
                Weatherproof and designed to last.
              </p>
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <Car className="w-16 h-16 mx-auto text-gray-500" />
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-[#9cff1e]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#9cff1e]/20 group-hover:bg-[#9cff1e]/20 transition-all duration-300">
                <span className="text-3xl font-bold text-[#9cff1e]">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Someone Scans</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                When someone needs to reach you, they scan your QR code with their phone camera.
              </p>
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <Smartphone className="w-16 h-16 mx-auto text-gray-500" />
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-[#9cff1e]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#9cff1e]/20 group-hover:bg-[#9cff1e]/20 transition-all duration-300">
                <span className="text-3xl font-bold text-[#9cff1e]">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-white">Instant Message</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                A pre-written message opens in their messaging app, ready to send instantly.
              </p>
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gray-900 text-gray-400 border-gray-800">
              We specialize in
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Features that matter
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Designed with your privacy, convenience, and peace of mind in focus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Privacy First</h3>
              <p className="text-gray-400 leading-relaxed">
                Your contact information remains private. Others can message you without seeing your number.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
                <Zap className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Scan and send a message in under 5 seconds. No app downloads required.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Globe className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Universal</h3>
              <p className="text-gray-400 leading-relaxed">
                Works with any smartphone and messaging app. WhatsApp, SMS, Telegram - you choose.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                <Award className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Weatherproof</h3>
              <p className="text-gray-400 leading-relaxed">
                Durable, weather-resistant stickers that last for years without fading.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                <Users className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Community Friendly</h3>
              <p className="text-gray-400 leading-relaxed">
                Promotes polite communication and reduces parking conflicts in your community.
              </p>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Clock className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Always Available</h3>
              <p className="text-gray-400 leading-relaxed">
                No batteries, no maintenance. Your QRide sticker works 24/7, every day of the year.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              One-time purchase, lifetime peace of mind. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 text-white">Starter</h3>
              <div className="text-5xl font-bold mb-6 text-white">$9.99</div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">1 QRide Sticker</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Weatherproof Design</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Easy Setup</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Lifetime Use</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 border border-gray-700">Get Started</Button>
            </Card>

            <Card className="p-8 text-center bg-gray-900/50 border-[#9cff1e]/30 hover:border-[#9cff1e]/50 transition-all duration-300 backdrop-blur-sm relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#9cff1e] text-black font-medium">
                Most Popular
              </Badge>
              <h3 className="text-2xl font-bold mb-6 text-white">Family Pack</h3>
              <div className="text-5xl font-bold mb-6 text-white">$24.99</div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">3 QRide Stickers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Different Designs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Premium Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Free Shipping</span>
                </li>
              </ul>
              <Button className="w-full bg-[#9cff1e] text-black hover:bg-lime-400 font-medium">Choose Family Pack</Button>
            </Card>

            <Card className="p-8 text-center bg-gray-900/50 border-gray-800 hover:border-[#9cff1e]/30 transition-all duration-300 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 text-white">Business</h3>
              <div className="text-5xl font-bold mb-6 text-white">$49.99</div>
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">10 QRide Stickers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Custom Branding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#9cff1e] mr-3" />
                  <span className="text-gray-300">Bulk Discount</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#9cff1e] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "QRide saved me so much frustration! No more waiting around when I'm blocked in. 
                The person moved their car within minutes of me sending the message."
              </p>
              <div className="font-semibold text-white">Sarah M.</div>
              <div className="text-sm text-gray-500">Urban Professional</div>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#9cff1e] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "As a delivery driver, QRide has been a game-changer. 
                People can easily reach me if I need to move my van. Brilliant solution!"
              </p>
              <div className="font-semibold text-white">Mike T.</div>
              <div className="text-sm text-gray-500">Delivery Driver</div>
            </Card>

            <Card className="p-8 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#9cff1e] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "Simple, effective, and privacy-friendly. 
                Everyone in our apartment complex should have one of these!"
              </p>
              <div className="font-semibold text-white">Jennifer L.</div>
              <div className="text-sm text-gray-500">Apartment Resident</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Update with link to create page */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Car Communication?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of drivers already using QRide smart stickers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <button className="bg-[#9cff1e] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#8ae619] transition-all duration-300 hover:scale-105">
                  Get Your QR Sticker
                </button>
              </Link>
              <button className="border border-gray-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black border-t border-gray-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#9cff1e] to-lime-400 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">QRide</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing car communication, one QR code at a time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-white">Connect</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-[#9cff1e] transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 QRide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
