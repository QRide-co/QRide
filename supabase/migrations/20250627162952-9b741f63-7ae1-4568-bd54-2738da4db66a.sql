-- Create a table for QR codes
CREATE TABLE public.qr_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  unique_code TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  default_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on unique_code for faster lookups
CREATE INDEX idx_qr_codes_unique_code ON public.qr_codes(unique_code);

-- Enable Row Level Security (optional - can be made public for now)
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read QR codes (for scanning)
CREATE POLICY "Anyone can view QR codes" 
  ON public.qr_codes 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create a policy that allows anyone to create QR codes (for now)
CREATE POLICY "Anyone can create QR codes" 
  ON public.qr_codes 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Add unique constraint to name
ALTER TABLE public.qr_codes ADD CONSTRAINT unique_qr_code_name UNIQUE (name);
