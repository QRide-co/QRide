import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://uipodeoczfvqikkxvgsq.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcG9kZW9jemZ2cWlra3h2Z3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzk1MTYsImV4cCI6MjA2NjYxNTUxNn0.Sgcx8LM4DvJIWxWZbxePLCdeMHmGwZgXfqHycuuMhMY";

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request - return method not allowed with helpful message
  if (req.method === 'GET') {
    res.status(405).json({ 
      error: "Method not allowed", 
      message: "This endpoint only accepts POST requests with message data",
      expected_body: { code: "string", message: "string" }
    });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    let code, message;
    if (req.body) {
      ({ code, message } = req.body);
    } else {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => { data += chunk; });
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        ({ code, message } = body as any);
      } catch (e) {
        res.status(400).json({ error: "Invalid JSON body" });
        return;
      }
    }
    if (!code || !message) {
      res.status(400).json({ error: "Missing code or message" });
      return;
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Look up phone number from Supabase
    let phone_number = null;
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('phone_number')
        .eq('unique_code', code)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        res.status(404).json({ error: "QR code not found" });
        return;
      }
      
      if (!data || !data.phone_number) {
        res.status(404).json({ error: "QR code not found or missing phone number" });
        return;
      }
      
      phone_number = data.phone_number;
    } catch (e) {
      console.error('Database lookup error:', e);
      res.status(500).json({ error: "Failed to look up phone number" });
      return;
    }

    // Insert message into Supabase messages table
    try {
      const { error } = await supabase
        .from('messages')
        .insert({ code, phone_number, message });
      if (error) {
        console.error('Failed to insert message:', error);
        res.status(500).json({ error: "Failed to queue message" });
        return;
      }
    } catch (error) {
      console.error('Failed to insert message:', error);
      res.status(500).json({ error: "Failed to queue message" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Unexpected error in send-message API:', error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message || "An unexpected error occurred"
    });
  }
}
