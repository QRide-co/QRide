import { promises as fs } from "fs";
import path from "path";
import { createClient } from '@supabase/supabase-js';

const MESSAGES_PATH = path.join(process.cwd(), "messages.json");
const SUPABASE_URL = process.env.SUPABASE_URL || "https://uipodeoczfvqikkxvgsq.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcG9kZW9jemZ2cWlra3h2Z3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzk1MTYsImV4cCI6MjA2NjYxNTUxNn0.Sgcx8LM4DvJIWxWZbxePLCdeMHmGwZgXfqHycuuMhMY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function (req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { code, message } = req.body;
  if (!code || !message) {
    res.status(400).json({ error: "Missing code or message" });
    return;
  }

  // Look up phone number from Supabase
  let phone_number = null;
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('phone_number')
      .eq('unique_code', code)
      .single();
    if (error || !data || !data.phone_number) {
      res.status(404).json({ error: "QR code not found or missing phone number" });
      return;
    }
    phone_number = data.phone_number;
  } catch (e) {
    res.status(500).json({ error: "Failed to look up phone number" });
    return;
  }

  let messages: any[] = [];
  try {
    const data = await fs.readFile(MESSAGES_PATH, "utf-8");
    messages = JSON.parse(data);
  } catch {
    messages = [];
  }

  messages.push({
    code,
    phone_number,
    message,
    createdAt: new Date().toISOString(),
  });

  await fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2));
  res.status(200).json({ success: true });
} 