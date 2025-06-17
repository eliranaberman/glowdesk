
-- מחיקת המדיניות הבעייתיות הקיימות על storage.objects
DROP POLICY IF EXISTS "Allow authenticated users to upload to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow everyone to view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete from portfolio" ON storage.objects;

-- יצירת מדיניות חדשה ופשוטה לעלאת קבצים
CREATE POLICY "Allow upload for logged-in users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' 
  AND auth.uid() IS NOT NULL
);

-- מדיניות לצפייה בקבצים - פתוחה לכולם
CREATE POLICY "Allow public read access to portfolio"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- מדיניות למחיקת קבצים - רק למשתמש שהעלה
CREATE POLICY "Allow users to delete their uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' 
  AND auth.uid() IS NOT NULL
);
