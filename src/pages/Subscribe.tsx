import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Subscribe = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <Card className="bg-gray-900/70 border-gray-800 shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl font-bold">Subscribe to Activate</CardTitle>
          <CardDescription className="text-gray-400 text-lg mt-1">
            To activate your QR code, please subscribe to our service.<br />
            (This is a placeholder page. Integrate your payment/subscription flow here.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Link to="/">
            <Button className="w-full bg-[#9cff1e] text-black hover:bg-[#8ae619] font-semibold py-4 text-lg rounded-lg shadow-md">
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Subscribe; 