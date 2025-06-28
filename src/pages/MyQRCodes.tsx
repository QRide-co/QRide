import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MyQRCodes = () => {
  const location = useLocation();
  const isAdmin = location.search.includes('admin=1');
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(isAdmin);
  const [adminError, setAdminError] = useState('');
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin || !adminAuth) return;
    (async () => {
      const { data } = await supabase.from('qr_codes').select('*').order('created_at', { ascending: false });
      setQrCodes(data || []);
      setLoading(false);
    })();
  }, [isAdmin, adminAuth]);

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-400 mb-4">Page not found</p>
          <a href="/" className="text-[#9cff1e] hover:text-[#8ae619] underline">Return to Home</a>
        </div>
      </div>
    );
  }
  if (isAdmin && !adminAuth) {
    return (
      <Dialog open={showAdminModal}>
        <DialogContent className="max-w-sm mx-auto p-8 rounded-2xl bg-gray-900 border border-gray-800">
          <DialogHeader className="text-center mb-2">
            <div className="flex flex-col items-center justify-center mb-2">
              <Lock className="w-10 h-10 text-[#9cff1e] mb-2" />
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
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#9cff1e]"
              autoFocus
            />
            {adminError && <div className="text-red-500 text-sm text-center font-medium">{adminError}</div>}
            <button type="submit" className="w-full bg-[#9cff1e] text-black font-bold py-3 rounded-lg text-lg shadow hover:bg-[#8ae619] transition-all">Continue</button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          My QR Codes
        </h2>
        {loading ? (
          <div className="text-gray-400">Loading QR codes...</div>
        ) : qrCodes.length === 0 ? (
          <div className="text-gray-400">No QR codes found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <Card key={qr.id} className="bg-gray-900/70 border-gray-800 rounded-xl shadow-md flex flex-col">
                <CardContent className="flex-1 flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-lg text-white truncate max-w-[70%]">{qr.name}</div>
                    <Link to={`/edit/${qr.id}?admin=1`} className="text-[#9cff1e] hover:text-[#8ae619]" aria-label="Edit QR Code">
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
      </div>
    </div>
  );
};

export default MyQRCodes; 