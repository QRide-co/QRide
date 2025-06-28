import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';
import { ArrowLeft, Download, Copy, Lock } from 'lucide-react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import JSZip from 'jszip';
import _ from 'lodash';

const CreateQR = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.search.includes('admin=1');
  const isFromAdmin = location.state && location.state.fromAdmin;
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
  const [authPassword, setAuthPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrPassword, setQrPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(isAdmin);
  const [adminError, setAdminError] = useState('');
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkQRCodes, setBulkQRCodes] = useState<any[]>([]);
  const [bulkDownloadLoading, setBulkDownloadLoading] = useState(false);
  const [bulkSuccess, setBulkSuccess] = useState(false);

  const defaultMessages = [
    'Please move your car',
    'من فضلك حرك سيارتك'
  ];

  useEffect(() => {
    // Check sessionStorage for admin auth
    if (isAdmin && sessionStorage.getItem('adminAuth') === 'true') {
      setAdminAuth(true);
      setShowAdminModal(false);
    }
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
          setQrPassword((data as any).password || null);
          // Only show password modal if navigated from scan page
          if ((location.state && location.state.fromScan) && (data.password && data.password.length > 0)) {
            setShowPasswordModal(true);
          } else if (!data.password || data.password.length === 0) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(true);
          }
        }
      })();
    }
  }, [id, location.state, isAdmin]);

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === qrPassword) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password.');
    }
  };

  const handleAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setAdminAuth(true);
      setShowAdminModal(false);
      setAdminError('');
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setAdminError('Incorrect password.');
    }
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
        const updateData: any = {
          name: name.trim(),
          phone_number: phoneNumber.trim(),
          default_message: defaultMessage.trim() || 'Hello! I need to contact you regarding your vehicle.',
        };
        if (newPassword.length >= 4) {
          updateData.password = newPassword;
        }
        const { error } = await supabase
          .from('qr_codes')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
        toast({ title: 'Updated!', description: 'QR code updated successfully.' });
        navigate('/');
        return;
      }
      if (newPassword.length < 4) {
        toast({
          title: "Error",
          description: "Please set a password of at least 4 characters",
          variant: "destructive",
        });
        return;
      }
      if (!defaultMessage) setDefaultMessage(defaultMessages[0]);
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
          password: newPassword,
          activated: false,
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

  const handleBulkGenerate = () => {
    setBulkModal(true);
  };

  const confirmBulkGenerate = async () => {
    setBulkLoading(true);
    try {
      // Fetch all existing Car QR Code names
      const { data: existing, error: fetchError } = await supabase.from('qr_codes').select('name');
      if (fetchError) throw fetchError;
      // Find the highest N in 'Car QR Code N'
      const maxNum = _.max(
        (existing || [])
          .map((qr: any) => {
            const match = qr.name && qr.name.match(/^Car QR Code (\d+)$/);
            return match ? parseInt(match[1], 10) : 0;
          })
      ) || 0;
      // Generate new names starting from maxNum + 1
      const codes = Array.from({ length: bulkCount }, (_, i) => ({
        name: `Car QR Code ${maxNum + i + 1}`,
        unique_code: generateUniqueCode(),
        phone_number: null,
        default_message: defaultMessages[0],
        activated: false,
      }));
      const { error, data } = await supabase.from('qr_codes').insert(codes).select();
      if (error) throw error;
      setBulkQRCodes(data || []);
      setBulkModal(false);
      setBulkSuccess(true);
      toast({ title: 'Success', description: `${codes.length} QR codes generated and saved!` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate QR codes', variant: 'destructive' });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    setBulkDownloadLoading(true);
    try {
      const zip = new JSZip();
      for (const qr of bulkQRCodes) {
        const url = `${window.location.origin}/scan/${qr.unique_code}`;
        const png = await QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
        const base64 = png.split(',')[1];
        zip.file(`${qr.name.replace(/\s+/g, '_')}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bulk-qr-codes.zip';
      link.click();
    } finally {
      setBulkDownloadLoading(false);
    }
  };

  const handleBulkFieldChange = (idx: number, field: 'name' | 'phone', value: string) => {
    setBulkQRCodes((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  if (id && !name && !isLoading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-400 mb-4">Page not found</p>
          <a href="/" className="text-[#ff6b00] hover:text-[#ff5a00] underline">Return to Home</a>
        </div>
      </div>
    );
  }

  if (isAdmin && !adminAuth && !isFromAdmin) {
    return (
      <Dialog open={showAdminModal}>
        <DialogContent className="max-w-sm mx-auto p-8 rounded-2xl bg-gray-900 border border-gray-800">
          <DialogHeader className="text-center mb-2">
            <div className="flex flex-col items-center justify-center mb-2">
              <Lock className="w-10 h-10 text-[#ff6b00] mb-2" />
              <DialogTitle className="text-2xl font-bold text-white">Admin Login</DialogTitle>
            </div>
            <p className="text-gray-400 text-base">Enter the admin password to access this page.</p>
          </DialogHeader>
          <form onSubmit={handleAdminPassword} className="space-y-5 mt-4">
            <input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
              autoFocus
            />
            {adminError && <div className="text-red-500 text-sm text-center font-medium">{adminError}</div>}
            <button type="submit" className="w-full bg-[#ff6b00] text-black font-bold py-3 rounded-lg text-lg shadow hover:bg-[#ff5a00] transition-all">Continue</button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={isAdmin ? "/my-qr-codes?admin=1" : "/"} className="flex items-center gap-2 text-[#ff6b00] hover:text-[#ff5a00] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {isAdmin ? "Back to My QR Codes" : "Back to Home"}
            </Link>
            <h1 className="text-2xl font-bold">Create QR Code</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Password Modal for Edit */}
          {id && showPasswordModal && !isAuthenticated && (
            <Dialog open={showPasswordModal}>
              <DialogContent className="max-w-sm mx-auto">
                <DialogHeader>
                  <DialogTitle>Enter Password to Edit QR Code</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                  {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                  <Button type="submit" className="w-full bg-[#ff6b00] text-white font-semibold">Continue</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {/* Only show the rest if authenticated or not editing */}
          {(!id || isAuthenticated) && (
            <>
              {!generatedQR ? (
                <Card className="bg-white border border-gray-200 shadow-lg mb-8">
                  <CardHeader>
                    <CardTitle className="text-gray-900">{id ? 'Edit QR Code' : 'Generate Your QRide Sticker'}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {id ? 'Update your QR code details below.' : 'Create a QR code that allows others to contact you about your vehicle'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Only show QR Code Name input for admin */}
                      {isAdmin && (
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-900">QR Code Name *</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="e.g., My Car, Work Vehicle"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                            required
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-900">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="defaultMessage" className="text-gray-900">Default Message *</Label>
                        <select
                          id="defaultMessage"
                          value={defaultMessage}
                          onChange={e => setDefaultMessage(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 w-full px-4 py-3 rounded-lg"
                          required
                        >
                          {defaultMessages.map((msg) => (
                            <option key={msg} value={msg}>{msg}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-gray-900">{qrPassword ? 'Change Password' : 'Set Password'} (required to edit in future)</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder={qrPassword ? 'Enter new password (leave blank to keep current)' : 'Set a password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                          minLength={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold text-lg py-3 rounded-lg shadow"
                      >
                        {isLoading ? (id ? 'Updating...' : 'Generating...') : (id ? 'Update QR Code' : 'Generate QR Code')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white border border-gray-200 shadow-lg mb-8">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Your QR Code is Ready!</CardTitle>
                    <CardDescription className="text-gray-600">
                      Download and place this QR code on your vehicle
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <img src={generatedQR.qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-900">QR Code ID:</Label>
                        <p className="text-gray-600 text-sm font-mono">{generatedQR.uniqueCode}</p>
                      </div>
                      <div>
                        <Label className="text-gray-900">Scan URL:</Label>
                        <p className="text-gray-600 text-sm break-all">{generatedQR.scanUrl}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={downloadQR}
                        className="flex-1 bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                      <Button
                        onClick={copyLink}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-100"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                    <Button
                      onClick={resetForm}
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    >
                      Create Another QR Code
                    </Button>
                  </CardContent>
                </Card>
              )}
              {/* Show QR code in edit mode or after creation (edit mode only) */}
              {(id && qrImageUrl && scanUrl) && (
                <Card className="bg-white border border-gray-200 shadow-lg mb-8">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Your QR Code</CardTitle>
                    <CardDescription className="text-gray-600">
                      Download and place this QR code on your vehicle
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <img src={qrImageUrl} alt="Generated QR Code" className="w-64 h-64" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-900">Scan URL:</Label>
                        <p className="text-gray-600 text-sm break-all">{scanUrl}</p>
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
                        className="flex-1 bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold"
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
                        className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-100"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="flex gap-4 mb-6">
                <Button onClick={handleBulkGenerate} variant="outline">Generate Bulk</Button>
              </div>
              {bulkModal && (
                <Dialog open={bulkModal} onOpenChange={setBulkModal}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate Bulk QR Codes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label htmlFor="bulk-count">Number of QR Codes</Label>
                      <Input
                        id="bulk-count"
                        type="number"
                        min={1}
                        value={bulkCount}
                        onChange={e => setBulkCount(Number(e.target.value))}
                        className="w-full"
                        disabled={bulkLoading}
                      />
                      <Button onClick={confirmBulkGenerate} className="w-full" disabled={bulkLoading}>
                        {bulkLoading ? 'Generating...' : 'Generate'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {bulkSuccess ? (
                <div className="mt-8 text-center">
                  <div className="text-green-600 text-lg font-semibold mb-4">QR codes generated and saved successfully!</div>
                  <Button onClick={handleBulkDownload} disabled={bulkDownloadLoading} className="bg-[#ff6b00] text-white font-semibold px-8 py-3 rounded-lg text-lg">
                    {bulkDownloadLoading ? 'Preparing Download...' : 'Download as PNG'}
                  </Button>
                </div>
              ) : bulkQRCodes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Generated QR Codes</h3>
                  <div className="grid gap-4">
                    {bulkQRCodes.map((qr, idx) => (
                      <Card key={qr.uniqueCode} className="p-4 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 flex flex-col md:flex-row gap-4 items-center">
                          <Input
                            placeholder="Name"
                            value={qr.name}
                            onChange={e => handleBulkFieldChange(idx, 'name', e.target.value)}
                            className="mb-2 md:mb-0"
                          />
                          <Input
                            placeholder="Phone Number"
                            value={qr.phone}
                            onChange={e => handleBulkFieldChange(idx, 'phone', e.target.value)}
                          />
                        </div>
                        <div className="flex-shrink-0">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + '/scan/' + qr.uniqueCode)}`}
                            alt="QR Code"
                            className="w-20 h-20"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQR;
