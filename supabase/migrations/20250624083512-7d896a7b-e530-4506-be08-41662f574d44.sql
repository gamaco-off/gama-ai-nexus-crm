
-- Reset credits to 100 for the current user
UPDATE public.profiles 
SET credits = 100, updated_at = now() 
WHERE id = '01882ecd-bb93-42a5-af54-b00a4f96b735';
