
-- מחיקת כל המדיניות הישנות והבעייתיות על portfolio_items
DROP POLICY IF EXISTS "Users can view all portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio items" ON portfolio_items;

-- מחיקת מדיניות בעייתיות על storage.objects
DROP POLICY IF EXISTS "Allow authenticated users to upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own portfolio images" ON storage.objects;

-- וידוא שהדלי portfolio קיים ופומבי
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- יצירת מדיניות פשוטות וברורות על portfolio_items
CREATE POLICY "Anyone can view portfolio items"
ON portfolio_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert portfolio items"
ON portfolio_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own portfolio items"
ON portfolio_items FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- יצירת מדיניות פשוטות על storage.objects לדלי portfolio
CREATE POLICY "Allow authenticated users to upload to portfolio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow everyone to view portfolio images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow users to delete from portfolio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');

-- וידוא שהפונקציה has_role קיימת (ללא שינוי)
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = $2
  );
END;
$function$;
