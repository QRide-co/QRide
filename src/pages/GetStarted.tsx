import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GetStarted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-4">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">Get Started</h1>
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Activate Your Sticker</h2>
            <p className="text-gray-600 mb-6 text-center">Already have a QRide sticker? Activate it now to enable all features.</p>
            <Link to="/scan" className="w-full">
              <Button className="w-full bg-[#ff6b00] text-white hover:bg-orange-500 font-bold text-lg py-3 rounded-xl shadow-xl transition-all duration-200">
                Scan QR Code
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetStarted; 