import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateQR from "./pages/CreateQR";
import ScanQR from "./pages/ScanQR";
import NotFound from "./pages/NotFound";
import Subscribe from './pages/Subscribe';
import MyQRCodes from './pages/MyQRCodes';
import GetStarted from './pages/GetStarted';
import ScanEntry from './pages/ScanEntry';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/scan" element={<ScanEntry />} />
          <Route path="/create" element={<CreateQR />} />
          <Route path="/edit/:id" element={<CreateQR />} />
          <Route path="/scan/:code" element={<ScanQR />} />
          <Route path="/subscribe/:code" element={<Subscribe />} />
          <Route path="/my-qr-codes" element={<MyQRCodes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
