-- Create user WhatsApp settings table for multi-tenant configuration
CREATE TABLE public.user_whatsapp_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_whatsapp_number TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_address TEXT,
  preferred_send_time TIME DEFAULT '09:00:00',
  reminder_hours_before INTEGER DEFAULT 24,
  timezone TEXT DEFAULT 'Asia/Jerusalem',
  auto_reminders_enabled BOOLEAN DEFAULT true,
  confirmation_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_whatsapp_settings
ALTER TABLE public.user_whatsapp_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_whatsapp_settings
CREATE POLICY "Users can view their own WhatsApp settings" 
ON public.user_whatsapp_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own WhatsApp settings" 
ON public.user_whatsapp_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own WhatsApp settings" 
ON public.user_whatsapp_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own WhatsApp settings" 
ON public.user_whatsapp_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_whatsapp_settings_updated_at
BEFORE UPDATE ON public.user_whatsapp_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint to ensure one setting per user
ALTER TABLE public.user_whatsapp_settings ADD CONSTRAINT unique_user_whatsapp_settings UNIQUE (user_id);