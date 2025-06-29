import { promises as fs } from "fs";
import path from "path";

const MESSAGES_PATH = path.join(process.cwd(), "messages.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { code, message } = req.body;
  if (!code || !message) {
    res.status(400).json({ error: "Missing code or message" });
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
    message,
    createdAt: new Date().toISOString(),
  });

  await fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2));
  res.status(200).json({ success: true });
} 