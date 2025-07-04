-- Add confirmation tracking fields to appointments table
ALTER TABLE public.appointments 
ADD COLUMN confirmation_status TEXT DEFAULT 'pending',
ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN confirmation_response TEXT,
ADD COLUMN reminder_sent_at TIMESTAMP WITH TIME ZONE;

-- Create message templates table for WhatsApp messages
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_type TEXT NOT NULL, -- 'reminder', 'confirmation', 'cancellation'
  template_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on message_templates
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for message_templates
CREATE POLICY "Users can view their own message templates" 
ON public.message_templates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own message templates" 
ON public.message_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own message templates" 
ON public.message_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own message templates" 
ON public.message_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create notification logs table for tracking all sent messages
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'reminder', 'confirmation', 'cancellation'
  channel TEXT NOT NULL, -- 'whatsapp', 'sms', 'email'
  phone_number TEXT,
  message_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'read'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  external_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notification_logs
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for notification_logs
CREATE POLICY "Users can view their own notification logs" 
ON public.notification_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create notification logs" 
ON public.notification_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification logs" 
ON public.notification_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on message_templates
CREATE TRIGGER update_message_templates_updated_at
BEFORE UPDATE ON public.message_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default message templates
INSERT INTO public.message_templates (user_id, template_type, template_name, content, is_default) 
SELECT 
  auth.uid(),
  'reminder',
  'תזכורת תור סטנדרטית',
  'שלום {customer_name}! 👋
תזכורת לתור שלך מחר ({date}) בשעה {time}
שירות: {service}
כתובת: {address}
לאישור התור השב "כן" 
לביטול השב "ביטול"
תודה! 💅',
  true
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.message_templates (user_id, template_type, template_name, content, is_default) 
SELECT 
  auth.uid(),
  'confirmation',
  'בקשת אישור תור',
  'שלום {customer_name}! 
יש לך תור ב-{date} בשעה {time}
שירות: {service}
אנא אשר/י את הגעתך בהשבה "אישור"
או בטל/י בהשבה "ביטול"
תודה! ✨',
  true
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.message_templates (user_id, template_type, template_name, content, is_default) 
SELECT 
  auth.uid(),
  'cancellation',
  'אישור ביטול תור',
  'שלום {customer_name},
תורך ב-{date} בשעה {time} בוטל בהצלחה.
לקביעת תור חדש ניתן לחזור אלינו.
תודה על ההבנה! 🙏',
  true
WHERE auth.uid() IS NOT NULL;