import { promises as fs } from "fs";
import path from "path";

const MESSAGES_PATH = path.join(process.cwd(), "messages.json");
const SECRET = process.env.SMS_RELAY_SECRET || "changeme";

export default async function (req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { secret } = req.query;
  if (secret !== SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let messages = [];
  try {
    const data = await fs.readFile(MESSAGES_PATH, "utf-8");
    messages = JSON.parse(data);
  } catch {
    messages = [];
  }

  // Clear the queue after fetching
  await fs.writeFile(MESSAGES_PATH, "[]");
  res.status(200).json({ messages });
} 