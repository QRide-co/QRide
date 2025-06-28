
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, QrCode, Smartphone } from "lucide-react";
import QRCodeLib from 'qrcode';

const CreateQR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isEdit = Boolean(id);
  const fromAdmin = location.state?.fromAdmin;
  const fromScan = location.state?.fromScan;

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    default_message: ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchQRData();
    }
  }, [id, isEdit]);

  const fetchQRData = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name,
          phone_number: data.phone_number,
          default_message: data.default_message
        });
        // Generate QR code for existing data
        const scanUrl = `${window.location.origin}/scan/${data.unique_code}`;
        const qrDataUrl = await QRCodeLib.toDataURL(scanUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrDataUrl);
      }
    } catch (error) {
      console.error('Error fetching QR data:', error);
      toast({
        title: "Error",
        description: "Failed to load QR code data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone_number) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let qrData;
      
      if (isEdit) {
        // Update existing QR code
        const { data, error } = await supabase
          .from('qr_codes')
          .update({
            name: formData.name,
            phone_number: formData.phone_number,
            default_message: formData.default_message,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        qrData = data;
      } else {
        // Create new QR code
        const uniqueCode = generateUniqueCode();
        
        const { data, error } = await supabase
          .from('qr_codes')
          .insert({
            name: formData.name,
            phone_number: formData.phone_number,
            default_message: formData.default_message,
            unique_code: uniqueCode
          })
          .select()
          .single();

        if (error) throw error;
        qrData = data;
      }

      // Generate QR code
      const scanUrl = `${window.location.origin}/scan/${qrData.unique_code}`;
      const qrDataUrl = await QRCodeLib.toDataURL(scanUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      setQrCodeUrl(qrDataUrl);

      toast({
        title: isEdit ? "QR Code Updated!" : "QR Code Created!",
        description: isEdit ? "Your QR code has been successfully updated." : "Your QR code has been generated successfully.",
      });

    } catch (error) {
      console.error('Error saving QR code:', error);
      toast({
        title: "Error",
        description: "Failed to save QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `${formData.name.replace(/\s+/g, '_')}_QRCode.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR code data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to={fromAdmin ? "/my-qr-codes?admin=1" : fromScan ? "/" : "/"} 
              className="flex items-center gap-2 text-[#ff6b00] hover:text-[#ff5a00] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {fromAdmin ? "Back to My QR Codes" : "QRide"}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {isEdit ? "Edit Your QR Code" : "Create Your QR Code"}
            </h1>
            <p className="text-xl text-gray-600">
              {isEdit 
                ? "Update your QR code information below" 
                : "Fill in your details to generate a personalized QR code for your vehicle"
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">QR Code Information</CardTitle>
                <CardDescription className="text-gray-600">
                  This information will be used when someone scans your QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name or vehicle identifier"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-gray-300 focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="border-gray-300 focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">Default Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter a default message (e.g., 'Hi, I need to move my car')"
                      value={formData.default_message}
                      onChange={(e) => handleInputChange('default_message', e.target.value)}
                      rows={3}
                      className="border-gray-300 focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#ff6b00] text-white hover:bg-[#ff5a00] py-3 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEdit ? "Updating..." : "Generating..."}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        {isEdit ? "Update QR Code" : "Generate QR Code"}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* QR Code Preview */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Your QR Code</CardTitle>
                <CardDescription className="text-gray-600">
                  {qrCodeUrl ? "Your QR code is ready!" : "Generate your QR code to see it here"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {qrCodeUrl ? (
                  <>
                    <div className="bg-gray-50 p-8 rounded-xl">
                      <img 
                        src={qrCodeUrl} 
                        alt="Generated QR Code" 
                        className="mx-auto max-w-full h-auto"
                      />
                    </div>
                    <div className="space-y-3">
                      <Button 
                        onClick={handleDownload}
                        className="w-full bg-[#ff6b00] text-white hover:bg-[#ff5a00] py-3"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                      <p className="text-sm text-gray-600">
                        Save this QR code and place it in your vehicle where it's easily visible
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 p-12 rounded-xl">
                    <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Fill in the form and click "Generate QR Code" to see your QR code here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8 bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Smartphone className="w-5 h-5 text-[#ff6b00]" />
                How to Use Your QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">1. Download & Print</h4>
                  <p>Download your QR code and print it on a sticker or paper</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">2. Place in Vehicle</h4>
                  <p>Stick it on your car window, dashboard, or any visible location</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">3. Ready to Go</h4>
                  <p>Others can now scan to contact you when needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateQR;
