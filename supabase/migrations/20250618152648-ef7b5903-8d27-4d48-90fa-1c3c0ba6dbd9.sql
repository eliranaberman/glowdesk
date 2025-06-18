
-- Fix the database schema to match TypeScript interfaces and establish proper relationships

-- First, let's add the missing columns and fix the client_activity table
ALTER TABLE public.client_activity 
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS date timestamp with time zone;

-- Update existing records to have proper values
UPDATE public.client_activity 
SET 
  type = activity_type,
  description = COALESCE(notes, 'פעילות ללא תיאור'),
  date = created_at
WHERE type IS NULL OR description IS NULL OR date IS NULL;

-- Add missing updated_at column to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON public.clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key relationships to establish proper joins
-- First, make sure we have a users table that matches auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    email text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now()
);

-- Insert existing users from auth if they don't exist in public.users
INSERT INTO public.users (id, email, full_name)
SELECT DISTINCT 
    au.id, 
    au.email, 
    COALESCE(au.raw_user_meta_data->>'full_name', au.email)
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id);

-- Now add proper foreign key constraints
ALTER TABLE public.clients 
DROP CONSTRAINT IF EXISTS clients_assigned_rep_fkey,
ADD CONSTRAINT clients_assigned_rep_fkey 
FOREIGN KEY (assigned_rep) REFERENCES public.users(id);

ALTER TABLE public.client_activity 
DROP CONSTRAINT IF EXISTS client_activity_created_by_fkey,
ADD CONSTRAINT client_activity_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.users(id);

-- Fix appointments table to reference clients properly
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS appointments_customer_id_fkey,
ADD CONSTRAINT appointments_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.clients(id);

-- Add RLS policies for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all user profiles" ON public.users;
CREATE POLICY "Users can view all user profiles" 
ON public.users 
FOR SELECT 
USING (true); -- Allow viewing all user profiles for references

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);
