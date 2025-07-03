-- Add status column to messages table for delivery tracking
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'; 