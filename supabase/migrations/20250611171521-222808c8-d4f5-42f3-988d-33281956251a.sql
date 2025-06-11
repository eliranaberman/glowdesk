
-- Create storage bucket for social media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('social-media', 'social-media', true);

-- Create storage policies for social media bucket
CREATE POLICY "Users can upload social media files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'social-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view social media files" ON storage.objects
FOR SELECT USING (bucket_id = 'social-media');

CREATE POLICY "Users can update their social media files" ON storage.objects
FOR UPDATE USING (bucket_id = 'social-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their social media files" ON storage.objects
FOR DELETE USING (bucket_id = 'social-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable RLS on social_media_accounts and social_media_posts tables
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for social_media_accounts
CREATE POLICY "Users can view their own social media accounts" ON social_media_accounts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social media accounts" ON social_media_accounts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social media accounts" ON social_media_accounts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social media accounts" ON social_media_accounts
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for social_media_posts
CREATE POLICY "Users can view their own social media posts" ON social_media_posts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social media posts" ON social_media_posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social media posts" ON social_media_posts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social media posts" ON social_media_posts
FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_social_media_accounts_updated_at
BEFORE UPDATE ON social_media_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_posts_updated_at
BEFORE UPDATE ON social_media_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
