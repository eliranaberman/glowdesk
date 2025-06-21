
-- Update all existing clients to assign them to the first user in the system
-- This ensures all existing sample data becomes visible
UPDATE public.clients 
SET user_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Also update assigned_rep to match user_id for consistency
UPDATE public.clients 
SET assigned_rep = user_id
WHERE assigned_rep IS NULL;
