-- צור טבלת business_profiles למידע נוסף על העסק
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_phone text,
  business_address text,
  business_hours jsonb DEFAULT '{}',
  setup_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- הפעלת RLS
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- מדיניות גישה - משתמשים יכולים לגשת רק למידע שלהם
CREATE POLICY "Users can view their own business profile"
ON public.business_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business profile"
ON public.business_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile"
ON public.business_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business profile"
ON public.business_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- טריגר לעדכון updated_at
CREATE OR REPLACE FUNCTION public.update_business_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_business_profiles_updated_at();