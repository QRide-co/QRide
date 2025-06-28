
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { QrCode, Scan, MessageCircle, Phone, Zap, Shield, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-[#ff6b00]" />
              <span className="text-2xl font-bold text-gray-900">QRide</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="#features" className="text-gray-600 hover:text-[#ff6b00] transition-colors">Features</Link>
              <Link to="#how-it-works" className="text-gray-600 hover:text-[#ff6b00] transition-colors">How it Works</Link>
              <Link to="/create" className="bg-[#ff6b00] text-white px-4 py-2 rounded-lg hover:bg-[#ff5a00] transition-colors">Create QR</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#ff6b00] to-[#ff8533] bg-clip-text text-transparent">
            Smart QR Codes for Vehicle Communication
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create QR codes for your vehicle that allow others to contact you instantly without revealing your personal information. Perfect for parking situations, emergencies, or any time someone needs to reach you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="bg-[#ff6b00] text-white hover:bg-[#ff5a00] px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                <QrCode className="w-5 h-5 mr-2" />
                Create Your QR Code
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white px-8 py-4 text-lg font-semibold rounded-xl">
              <Scan className="w-5 h-5 mr-2" />
              Scan Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Why Choose QRide?</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our smart QR code system makes vehicle communication seamless, secure, and convenient.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ff6b00]/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-[#ff6b00]" />
                </div>
                <CardTitle className="text-gray-900">Instant Communication</CardTitle>
                <CardDescription className="text-gray-600">
                  Allow others to contact you via SMS or call without sharing your personal number publicly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ff6b00]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#ff6b00]" />
                </div>
                <CardTitle className="text-gray-900">Privacy Protected</CardTitle>
                <CardDescription className="text-gray-600">
                  Your personal information stays private while still enabling communication when needed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ff6b00]/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#ff6b00]" />
                </div>
                <CardTitle className="text-gray-900">Works Offline</CardTitle>
                <CardDescription className="text-gray-600">
                  SMS functionality works without internet connection, perfect for any situation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b00] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Create Your QR Code</h3>
              <p className="text-gray-600">Enter your name, phone number, and a default message to create your personalized QR code.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b00] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Display in Your Vehicle</h3>
              <p className="text-gray-600">Print and place your QR code sticker on your car window or dashboard where it's easily visible.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b00] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Communication</h3>
              <p className="text-gray-600">Others can scan your code to send you a message or call you directly when needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#ff6b00] to-[#ff8533]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">Create your QR code in less than a minute</p>
          <Link to="/create">
            <Button size="lg" className="bg-white text-[#ff6b00] hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
              Create Your QR Code Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-6 h-6 text-[#ff6b00]" />
            <span className="text-xl font-bold text-gray-900">QRide</span>
          </div>
          <p className="text-gray-600">Smart QR codes for smarter communication</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
