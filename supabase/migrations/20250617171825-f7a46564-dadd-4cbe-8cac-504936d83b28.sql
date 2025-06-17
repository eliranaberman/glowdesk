
-- תיקון bucket expenses והפיכתו ל-public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'expenses';

-- יצירת מדיניות פשוטות לחלוטין על storage.objects עבור bucket expenses
CREATE POLICY "Simple expenses upload policy"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'expenses' AND auth.uid() IS NOT NULL);

CREATE POLICY "Simple expenses read policy"
ON storage.objects FOR SELECT
USING (bucket_id = 'expenses');

CREATE POLICY "Simple expenses delete policy"
ON storage.objects FOR DELETE
USING (bucket_id = 'expenses' AND auth.uid() IS NOT NULL);

-- וידוא שהבucket קיים (במידה ולא)
INSERT INTO storage.buckets (id, name, public)
VALUES ('expenses', 'expenses', true)
ON CONFLICT (id) DO NOTHING;
