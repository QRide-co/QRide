-- Add status column to messages table for SMS delivery tracking
ALTER TABLE messages ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'; 