-- Create messages table for SMS relay queue
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  phone_number text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
); 