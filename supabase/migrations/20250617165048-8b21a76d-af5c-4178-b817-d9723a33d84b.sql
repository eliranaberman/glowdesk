
-- תיקון סופי למניעת recursion - מחיקת כל המדיניות הבעייתיות
-- מחיקת כל המדיניות על storage.objects
DROP POLICY IF EXISTS "Allow authenticated users to upload to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow everyone to view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete from portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload for logged-in users" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins and social managers can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and social managers can upload social media images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their portfolio images" ON storage.objects;

-- מחיקת כל המדיניות על user_roles
DROP POLICY IF EXISTS "Only admins can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can read roles" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON user_roles;

-- יצירת מדיניות פשוטות לחלוטין על storage.objects
CREATE POLICY "Simple upload policy"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.uid() IS NOT NULL);

CREATE POLICY "Simple read policy"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Simple delete policy"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio' AND auth.uid() IS NOT NULL);

-- יצירת מדיניות פשוטות לחלוטין על user_roles
CREATE POLICY "Simple user roles read"
ON user_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Simple user roles manage"
ON user_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- וידוא שהבucket קיים
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;
