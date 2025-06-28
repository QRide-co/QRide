import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GetStarted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-4">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">Get Started</h1>
        {/* Buy Car Sticker Card */}
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Buy Car Sticker</h2>
            <p className="text-gray-600 mb-6 text-center">Order a QRide sticker for your car and enable instant contact. Delivered to your door.</p>
            <a
              href="https://wa.me/201094542810?text=I%20want%20to%20order%20a%20car%20qr%20code%20sticker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-green-500 text-white hover:bg-green-600 font-bold text-lg py-3 rounded-xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                {/* WhatsApp Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" className="inline-block align-middle"><path fill="#fff" d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.605 1.826 6.5L4 29l7.74-1.792A12.94 12.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.09 0-4.13-.547-5.89-1.583l-.42-.25-4.59 1.063 1.09-4.47-.27-.44A10.93 10.93 0 015 15c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11zm5.29-7.71c-.29-.145-1.71-.84-1.98-.935-.27-.1-.47-.145-.67.145-.2.29-.77.935-.95 1.125-.17.2-.35.22-.64.075-.29-.145-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.025-.51-.075-.145-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51-.17-.01-.36-.01-.56-.01-.2 0-.52.075-.8.36-.27.29-1.05 1.02-1.05 2.48 0 1.46 1.08 2.87 1.23 3.07.15.2 2.13 3.26 5.17 4.44.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.09 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z"/></svg>
                Buy on WhatsApp
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GetStarted; 