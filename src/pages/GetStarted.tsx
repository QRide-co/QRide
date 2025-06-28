import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QrReader from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = (data: string | null) => {
    if (data) {
      // Extract code from URL or raw code
      const match = data.match(/scan\/(.+)$/);
      const code = match ? match[1] : data;
      if (code) {
        navigate(`/edit/${code}`);
      } else {
        setError('Invalid QR code.');
      }
      setScanning(false);
    }
  };

  const handleError = (err: any) => {
    setError('Camera error. Please allow camera access and try again.');
    setScanning(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-4">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">Get Started</h1>
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Activate Your Sticker</h2>
            <p className="text-gray-600 mb-6 text-center">Already have a QRide sticker? Scan it now to activate and edit your info.</p>
            {scanning ? (
              <div className="w-full flex flex-col items-center">
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '100%' }}
                />
                <Button className="mt-4" variant="outline" onClick={() => setScanning(false)}>Cancel</Button>
              </div>
            ) : (
              <Button className="w-full bg-[#ff6b00] text-white hover:bg-orange-500 font-bold text-lg py-3 rounded-xl shadow-xl transition-all duration-200" onClick={() => { setScanning(true); setError(''); }}>
                Scan QR Code
              </Button>
            )}
            {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetStarted; 