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
  const [fetchingQR, setFetchingQR] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [packageType, setPackageType] = useState<'basic' | 'advanced'>('basic');

  const defaultMessages = [
    'Please move your car',
    'من فضلك حرك سيارتك'
  ];

  // Add country list and state
  const countryList = [
    { name: 'Egypt', code: '+20' },
    { name: 'Algeria', code: '+213' },
    { name: 'Bahrain', code: '+973' },
    { name: 'Canada', code: '+1' },
    { name: 'France', code: '+33' },
    { name: 'Germany', code: '+49' },
    { name: 'Italy', code: '+39' },
    { name: 'Jordan', code: '+962' },
    { name: 'Kuwait', code: '+965' },
    { name: 'Lebanon', code: '+961' },
    { name: 'Libya', code: '+218' },
    { name: 'Morocco', code: '+212' },
    { name: 'Oman', code: '+968' },
    { name: 'Qatar', code: '+974' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'Sudan', code: '+249' },
    { name: 'Syria', code: '+963' },
    { name: 'Tunisia', code: '+216' },
    { name: 'UAE', code: '+971' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'United States', code: '+1' },
    // ... add more countries as needed
  ];
  const sortedCountries = [countryList[0], ...countryList.slice(1).sort((a, b) => a.name.localeCompare(b.name))];
  const [country, setCountry] = useState(sortedCountries[0]);

  const stripCountryCode = (number: string, countryCode: string) => {
    if (!number) return '';
    let n = number.replace(/\D/g, '');
    const cc = countryCode.replace('+', '');
    if (n.startsWith(cc)) {
      n = n.slice(cc.length);
    }
    return n;
  };

  useEffect(() => {
    // Check sessionStorage for admin auth
    if (isAdmin && sessionStorage.getItem('adminAuth') === 'true') {
      setAdminAuth(true);
      setShowAdminModal(false);
    }
    if (id) {
      setFetchingQR(true);
      // Editing mode: fetch QR code data
      (async () => {
        const { data, error } = await supabase.from('qr_codes').select('*').eq('id', id).single();
        if (data) {
          setName(data.name);
          setPhoneNumber(stripCountryCode(data.phone_number, country.code));
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
          // Always require password if set (not null/empty) when editing
          if (data.password && data.password.length > 0) {
            setShowPasswordModal(true);
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
          setPackageType(data.package as 'basic' | 'advanced');
        }
        setFetchingQR(false);
      })();
    }
  }, [id, location.state, isAdmin]);

  useEffect(() => {
    // Remove auto-redirect and toast for bulkSuccess
  }, [bulkSuccess]);

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

  const formatPhoneNumberWithCountryCode = (number: string, countryCode: string) => {
    let n = number.trim().replace(/\D/g, '');
    n = n.replace(/^0+/, '');
    return `${countryCode}${n}`;
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
      const formattedPhone = formatPhoneNumberWithCountryCode(phoneNumber, country.code);
      if (id) {
        // Update existing QR code
        const updateData: any = {
          name: name.trim(),
          phone_number: formattedPhone,
          default_message: defaultMessage.trim() || 'Hello! I need to contact you regarding your vehicle.',
          package: packageType,
        };
        if (newPassword.length >= 4) {
          updateData.password = newPassword;
        }
        const { error } = await supabase
          .from('qr_codes')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
        setShowSuccessPage(true);
        setIsLoading(false);
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
          phone_number: formattedPhone,
          default_message: defaultMessage.trim() || 'Hello! I need to contact you regarding your vehicle.',
          password: newPassword,
          activated: false,
          package: packageType,
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
      if (field === 'phone') {
        const countryCode = country?.code || '+20';
        updated[idx][field] = formatPhoneNumberWithCountryCode(value, countryCode);
      } else {
        updated[idx][field] = value;
      }
      return updated;
    });
  };

  if (id && !name && !isLoading && !isAdmin && !fetchingQR) {
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

  if (showSuccessPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="flex flex-col items-center mb-6">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M9 12l2 2l4 -4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Success!</h2>
            <p className="text-lg text-gray-700 mb-4">Your QR code(s) have been generated successfully.</p>
            {!id && (
              <Button className="bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold px-6 py-3 rounded-lg mt-2" onClick={() => navigate('/my-qr-codes' + (isAdmin ? '?admin=1' : ''))}>
                Go to My QR Codes
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl rounded-3xl border-0 bg-white/90">
          <CardHeader className="pb-0">
            <CardTitle className="text-3xl font-bold text-center text-gray-900 mb-2">{isAdmin ? (id ? 'Edit QR Code' : 'Generate Your QRide Sticker') : 'Edit Your Information'}</CardTitle>
            <CardDescription className="text-center text-gray-500 mb-4">
              {isAdmin
                ? (id ? 'Update your QR code details below.' : 'Create a QR code that allows others to contact you about your vehicle')
                : 'Update your contact information below.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAdmin && !id && (
              <div className="mb-6 flex justify-center">
                <Button variant="outline" className="border-2 border-[#ff6b00] text-[#ff6b00] hover:bg-orange-50 font-semibold px-6 py-3 rounded-lg" onClick={handleBulkGenerate}>
                  Generate Bulk QR Codes
                </Button>
              </div>
            )}
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
                <Label htmlFor="country" className="text-gray-900">Country *</Label>
                <select
                  id="country"
                  value={country.name}
                  onChange={e => setCountry(sortedCountries.find(c => c.name === e.target.value) || sortedCountries[0])}
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 w-full px-4 py-3 rounded-lg"
                  required
                >
                  {sortedCountries.map(c => (
                    <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-900">Phone Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm">{country.code}</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-l-none"
                    required
                  />
                </div>
              </div>
              {isAdmin && (
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
              )}
              <div className="space-y-2">
                <Label htmlFor="packageType" className="text-gray-900">QR Code Package *</Label>
                <select
                  id="packageType"
                  value={packageType}
                  onChange={e => setPackageType(e.target.value as 'basic' | 'advanced')}
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 w-full px-4 py-3 rounded-lg"
                  required
                >
                  <option value="basic">Basic (All contact options)</option>
                  <option value="advanced">Advanced (SMS relay only, privacy enhanced)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-900">{qrPassword ? 'Change Password' : 'Set Password (required to edit in future)'}{!qrPassword && <span className="text-red-500"> *</span>}</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder={qrPassword ? 'Enter new password (leave blank to keep current)' : 'Set a password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                  minLength={4}
                  required={!qrPassword}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold text-lg py-3 rounded-lg shadow mt-2"
              >
                {isLoading ? (id ? 'Updating...' : 'Generating...') : (id ? 'Update QR Code' : 'Generate QR Code')}
              </Button>
            </form>
            {!isAdmin && id && (
              <div className="flex justify-center mb-4">
                <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                  Settings
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        {showSettings && (
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-8">
                {/* Contact QRide Option */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-900">Contact QRide</span>
                  <span className="text-gray-600 text-sm">If you have any issues, reach out to us directly on WhatsApp.</span>
                  <a
                    href="https://wa.me/201094542810"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition-all duration-200 mt-1"
                  >
                    {/* Official WhatsApp SVG icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" className="inline-block align-middle"><path fill="#fff" d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.605 1.826 6.5L4 29l7.74-1.792A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.09 0-4.13-.547-5.89-1.583l-.42-.25-4.59 1.063 1.09-4.47-.27-.44A10.93 10.93 0 015.083 15C5.083 9.477 9.477 5.083 15 5.083S24.917 9.477 24.917 15 20.523 24.917 15 24.917zm6.09-7.13c-.334-.167-1.98-.98-2.287-1.092-.307-.112-.53-.167-.753.167-.223.334-.86 1.092-1.055 1.317-.195.223-.39.25-.724.084-.334-.167-1.41-.52-2.687-1.655-.993-.885-1.664-1.977-1.86-2.31-.195-.334-.021-.513.146-.68.15-.15.334-.39.501-.584.167-.195.223-.334.334-.557.112-.223.056-.418-.028-.584-.084-.167-.753-1.815-1.032-2.49-.272-.655-.55-.567-.753-.577l-.642-.011c-.195 0-.513.084-.782.39-.27.307-1.08 1.06-1.08 2.584 0 1.523 1.11 2.995 1.263 3.203.153.207 2.187 3.36 5.29 4.583.74.295 1.316.472 1.767.606.743.236 1.42.203 1.956.123.597-.089 1.84-.753 2.099-1.48.26-.728.26-1.35.182-1.48-.077-.13-.285-.207-.597-.356z"/></svg>
                    Chat on WhatsApp
                  </a>
                </div>
                {/* Deactivate Subscription Option */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-900">Deactivate Subscription</span>
                  <span className="text-gray-600 text-sm">You can request to cancel your subscription. It will remain active until the end of your current paid month.</span>
                  <Button
                    variant="destructive"
                    disabled={cancelLoading || cancelSuccess}
                    onClick={async () => {
                      setCancelLoading(true);
                      await supabase.from('qr_codes').update({ cancellation_requested: true }).eq('id', id);
                      setCancelLoading(false);
                      setCancelSuccess(true);
                    }}
                    className="mt-1"
                  >
                    {cancelLoading ? 'Processing...' : cancelSuccess ? 'Cancellation Requested' : 'Cancel Subscription'}
                  </Button>
                  {cancelSuccess && (
                    <div className="text-green-600 text-sm mt-2">Your subscription will remain active until the end of your current paid month.</div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {bulkModal && (
          <Dialog open={bulkModal} onOpenChange={setBulkModal}>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Generate Bulk QR Codes</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <label className="block text-gray-900 font-semibold mb-1">How many QR codes do you want to generate?</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={bulkCount}
                  onChange={e => setBulkCount(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                />
                <div className="flex gap-4 justify-end mt-4">
                  <Button variant="outline" onClick={() => setBulkModal(false)} disabled={bulkLoading}>Cancel</Button>
                  <Button className="bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold" onClick={confirmBulkGenerate} disabled={bulkLoading}>
                    {bulkLoading ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {bulkSuccess && (
          <Dialog open={bulkSuccess} onOpenChange={() => { setBulkSuccess(false); }}>
            <DialogContent className="max-w-sm mx-auto text-center">
              <DialogHeader>
                <DialogTitle className="text-center">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M9 12l2 2l4 -4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="block text-2xl font-bold text-green-700 mb-2 text-center">Bulk QR Codes Generated!</span>
                </DialogTitle>
              </DialogHeader>
              <p className="text-lg text-gray-700 mb-4 text-center">Your bulk QR codes have been generated successfully.</p>
              <Button className="bg-[#ff6b00] text-white hover:bg-orange-500 font-semibold px-6 py-3 rounded-lg mt-2 w-full" onClick={() => navigate('/my-qr-codes' + (isAdmin ? '?admin=1' : ''))}>
                Go to My QR Codes
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CreateQR;
