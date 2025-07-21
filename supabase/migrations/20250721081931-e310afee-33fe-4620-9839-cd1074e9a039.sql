-- Add webhook URL columns to profiles table for persistent storage
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS leadgen_webhook_url TEXT,
ADD COLUMN IF NOT EXISTS emma_webhook_url TEXT;