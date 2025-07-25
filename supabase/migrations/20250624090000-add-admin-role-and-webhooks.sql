-- Add role and webhook columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS leadgen_webhook TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emma_webhook TEXT; 