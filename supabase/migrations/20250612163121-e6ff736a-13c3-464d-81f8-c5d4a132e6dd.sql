
-- Make the portfolio bucket public
UPDATE storage.buckets SET public = true WHERE id = 'portfolio';

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own portfolio images" ON storage.objects;

-- Create storage policies for portfolio bucket to allow authenticated users to upload and view files
CREATE POLICY "Allow authenticated users to upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow authenticated users to view portfolio images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow authenticated users to delete their own portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Drop all existing policies on portfolio_items table
DROP POLICY IF EXISTS "Users can view all portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio items" ON portfolio_items;

-- Enable RLS on portfolio_items table
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create new policies for portfolio_items
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
