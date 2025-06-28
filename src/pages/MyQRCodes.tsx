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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-4">Page not found</p>
        <a href="/" className="text-[#9cff1e] hover:text-[#8ae619] underline">Return to Home</a>
      </div>
    </div>
  );
};

export default MyQRCodes; 