import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const CreateQR = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<{
    qrCodeUrl: string;
    uniqueCode: string;
    scanUrl: string;
  } | null>(null);
  const { toast } = useToast();
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [scanUrl, setScanUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Editing mode: fetch QR code data
      (async () => {
        const { data, error } = await supabase.from('qr_codes').select('*').eq('id', id).single();
        if (data) {
          setName(data.name);
          setPhoneNumber(data.phone_number);
          setDefaultMessage(data.default_message);
          const url = `${window.location.origin}/scan/${data.unique_code}`;
          setScanUrl(url);
          // Generate QR code image
          const qrUrl = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: { dark: '#000000', light: '#FFFFFF' },
          });
          setQrImageUrl(qrUrl);
        }
      })();
    }
  }, [id]);

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      if (id) {
        // Update existing QR code
        const { error } = await supabase
          .from('qr_codes')
          .update({
            name: name.trim(),
            phone_number: phoneNumber.trim(),
            default_message: defaultMessage.trim() || 'Hello! I need to contact you regarding your vehicle.',
          })
          .eq('id', id);
        if (error) throw error;
        toast({ title: 'Updated!', description: 'QR code updated successfully.' });
        navigate('/');
        return;
      }
      const uniqueCode = generateUniqueCode();
      const scanUrl = `${window.location.origin}/scan/${uniqueCode}`;

      // Insert QR code data into database
      const { error } = await supabase
        .from('qr_codes')
        .insert({
          name: name.trim(),
          unique_code: uniqueCode,
          phone_number: phoneNumber.trim(),
          default_message: defaultMessage.trim() || 'Hello! I need to contact you regarding your vehicle.',
        });

      if (error) throw error;

      // Generate QR code image
      const qrCodeUrl = await QRCode.toDataURL(scanUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setGeneratedQR({
        qrCodeUrl,
        uniqueCode,
        scanUrl,
      });

      toast({
        title: "Success!",
        description: "Your QR code has been generated successfully",
      });
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to create QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.download = `qride-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = generatedQR.qrCodeUrl;
    link.click();
  };

  const copyLink = async () => {
    if (!generatedQR) return;
    
    try {
      await navigator.clipboard.writeText(generatedQR.scanUrl);
      toast({
        title: "Copied!",
        description: "QR code link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setDefaultMessage('');
    setGeneratedQR(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 backdrop-blur-sm bg-black/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[#9cff1e] hover:text-[#8ae619] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Create QR Code</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white">{id ? 'Edit QR Code' : 'Generate Your QRide Sticker'}</CardTitle>
              <CardDescription className="text-gray-400">
                {id ? 'Update your QR code details below.' : 'Create a QR code that allows others to contact you about your vehicle'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">QR Code Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., My Car, Work Vehicle"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Default Message (Optional)</Label>
                  <Input
                    id="message"
                    type="text"
                    placeholder="Custom message for people contacting you"
                    value={defaultMessage}
                    onChange={(e) => setDefaultMessage(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold"
                >
                  {isLoading ? (id ? 'Updating...' : 'Generating...') : (id ? 'Update QR Code' : 'Generate QR Code')}
                </Button>
              </form>
            </CardContent>
          </Card>
          {/* Show QR code in edit mode or after creation */}
          {(id && qrImageUrl && scanUrl) && (
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-white">Your QR Code</CardTitle>
                <CardDescription className="text-gray-400">
                  Download and place this QR code on your vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrImageUrl} alt="Generated QR Code" className="w-64 h-64" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Scan URL:</Label>
                    <p className="text-gray-400 text-sm break-all">{scanUrl}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `qride-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
                      link.href = qrImageUrl;
                      link.click();
                    }}
                    className="flex-1 bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button
                    onClick={async () => {
                      await navigator.clipboard.writeText(scanUrl);
                      toast({ title: 'Copied!', description: 'QR code link copied to clipboard' });
                    }}
                    variant="outline"
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {!generatedQR && (
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Your QR Code is Ready!</CardTitle>
                <CardDescription className="text-gray-400">
                  Download and place this QR code on your vehicle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <img src={generatedQR?.qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">QR Code ID:</Label>
                    <p className="text-[#9cff1e] font-mono text-sm">{generatedQR?.uniqueCode}</p>
                  </div>
                  
                  <div>
                    <Label className="text-white">Scan URL:</Label>
                    <p className="text-gray-400 text-sm break-all">{generatedQR?.scanUrl}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={downloadQR}
                    className="flex-1 bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button
                    onClick={copyLink}
                    variant="outline"
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <Button
                  onClick={resetForm}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Create Another QR Code
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQR;
