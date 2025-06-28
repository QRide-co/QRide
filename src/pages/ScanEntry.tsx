import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ScanEntry = () => {
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
    }
  };

  const handleError = (err: any) => {
    setError('Camera error. Please allow camera access and try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-4">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">Scan QR Code</h1>
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <p className="text-gray-600 mb-6 text-center">Scan your QRide sticker to activate or edit your information.</p>
            <div className="w-full flex flex-col items-center">
              <div className="w-full" style={{ maxWidth: 400 }}>
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  onResult={(result, error) => {
                    if (!!result) handleScan(result.getText());
                    if (!!error) handleError(error);
                  }}
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanEntry; 