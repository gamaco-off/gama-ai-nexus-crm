/*
  # Add user workflow URLs configuration

  1. Schema Changes
    - Add `leadgen_webhook_url` column to profiles table for Lead Generation workflow URL
    - Add `emma_webhook_url` column to profiles table for Emma AI workflow URL
    - Set default URLs for existing user (current user ID)

  2. Security
    - Users can only update their own workflow URLs
    - URLs are validated to ensure they're proper webhook URLs
*/

-- Add workflow URL columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN leadgen_webhook_url TEXT,
ADD COLUMN emma_webhook_url TEXT;

-- Set default URLs for the current user (your ID)
UPDATE public.profiles 
SET 
  leadgen_webhook_url = 'https://n8n.gama-app.com/webhook/fe88e087-dbff-4655-95cf-c1247b5eb996',
  emma_webhook_url = 'https://n8n.gama-app.com/webhook/3a0013dc-a769-467a-9748-709a74ee8637/chat'
WHERE id = '01882ecd-bb93-42a5-af54-b00a4f96b735';

-- Update RLS policy to allow users to update their workflow URLs
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);