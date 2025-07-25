
-- Reset credits to 100 for the current user
UPDATE public.profiles 
SET credits = 100, updated_at = now() 
WHERE id = '501b6a9d-8093-4e31-b8ac-b15d2a194d4e';
