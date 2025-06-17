
-- Remove Twitter from existing types and add TikTok support
-- First, let's add the new messages table to store all social media messages
CREATE TABLE public.social_media_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok')),
  account_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  message_text TEXT,
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'story_reply', 'comment')),
  external_message_id VARCHAR(255) NOT NULL,
  thread_id VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  replied_at TIMESTAMP WITH TIME ZONE,
  reply_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform, external_message_id)
);

-- Add webhook subscriptions table for managing real-time notifications
CREATE TABLE public.social_media_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok')),
  account_id VARCHAR(255) NOT NULL,
  webhook_id VARCHAR(255),
  webhook_url TEXT,
  subscription_fields TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform, account_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.social_media_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" 
  ON public.social_media_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" 
  ON public.social_media_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
  ON public.social_media_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for webhooks
CREATE POLICY "Users can view their own webhooks" 
  ON public.social_media_webhooks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own webhooks" 
  ON public.social_media_webhooks 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_social_media_messages_user_platform ON public.social_media_messages(user_id, platform);
CREATE INDEX idx_social_media_messages_received_at ON public.social_media_messages(received_at DESC);
CREATE INDEX idx_social_media_messages_is_read ON public.social_media_messages(is_read);

-- Update the existing social_media_accounts table to support TikTok and remove Twitter references
UPDATE public.social_media_accounts 
SET platform = 'facebook' 
WHERE platform = 'twitter';

-- Add constraint to limit platforms to the ones we support
ALTER TABLE public.social_media_accounts 
DROP CONSTRAINT IF EXISTS social_media_accounts_platform_check;

ALTER TABLE public.social_media_accounts 
ADD CONSTRAINT social_media_accounts_platform_check 
CHECK (platform IN ('facebook', 'instagram', 'tiktok'));
