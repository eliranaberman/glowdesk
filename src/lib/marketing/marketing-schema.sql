
-- Marketing Templates Table
CREATE TABLE IF NOT EXISTS marketing_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template_id UUID REFERENCES marketing_templates(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Marketing Messages Table
CREATE TABLE IF NOT EXISTS marketing_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed')) DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percentage NUMERIC(5,2) CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Coupon Assignments Table
CREATE TABLE IF NOT EXISTS coupon_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(coupon_id, client_id)
);

-- Add Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE marketing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for marketing_templates
CREATE POLICY "Users can view their own marketing templates"
  ON marketing_templates FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own marketing templates"
  ON marketing_templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own marketing templates"
  ON marketing_templates FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own marketing templates"
  ON marketing_templates FOR DELETE
  USING (auth.uid() = created_by);

-- Create policies for marketing_campaigns (similar pattern for other tables)
CREATE POLICY "Users can view their own marketing campaigns"
  ON marketing_campaigns FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own marketing campaigns"
  ON marketing_campaigns FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own marketing campaigns"
  ON marketing_campaigns FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own marketing campaigns"
  ON marketing_campaigns FOR DELETE
  USING (auth.uid() = created_by);

-- Create policies for marketing_messages
CREATE POLICY "Users can view all marketing messages"
  ON marketing_messages FOR SELECT
  TO authenticated;

CREATE POLICY "Users can insert marketing messages"
  ON marketing_messages FOR INSERT
  TO authenticated;

CREATE POLICY "Users can update marketing messages"
  ON marketing_messages FOR UPDATE
  TO authenticated;

CREATE POLICY "Users can delete marketing messages"
  ON marketing_messages FOR DELETE
  TO authenticated;

-- Create policies for coupons
CREATE POLICY "Users can view their own coupons"
  ON coupons FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own coupons"
  ON coupons FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own coupons"
  ON coupons FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own coupons"
  ON coupons FOR DELETE
  USING (auth.uid() = created_by);

-- Create policies for coupon_assignments
CREATE POLICY "Users can view all coupon assignments"
  ON coupon_assignments FOR SELECT
  TO authenticated;

CREATE POLICY "Users can insert coupon assignments"
  ON coupon_assignments FOR INSERT
  TO authenticated;

CREATE POLICY "Users can update coupon assignments"
  ON coupon_assignments FOR UPDATE
  TO authenticated;

CREATE POLICY "Users can delete coupon assignments"
  ON coupon_assignments FOR DELETE
  TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_template_id ON marketing_campaigns(template_id);
CREATE INDEX IF NOT EXISTS idx_marketing_messages_campaign_id ON marketing_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_messages_client_id ON marketing_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_coupon_assignments_coupon_id ON coupon_assignments(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_assignments_client_id ON coupon_assignments(client_id);
