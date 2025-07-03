import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://uipodeoczfvqikkxvgsq.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcG9kZW9jemZ2cWlra3h2Z3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzk1MTYsImV4cCI6MjA2NjYxNTUxNn0.Sgcx8LM4DvJIWxWZbxePLCdeMHmGwZgXfqHycuuMhMY";
const SECRET = process.env.SMS_RELAY_SECRET || "changeme";

export default async function (req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { secret, code } = req.query;
  if (secret !== SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    let query = supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (code) {
      query = query.eq('code', code);
    }
    const { data: messages, error } = await query;
    if (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
      return;
    }

    // Do NOT delete messages here; keep them for status tracking

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
} 