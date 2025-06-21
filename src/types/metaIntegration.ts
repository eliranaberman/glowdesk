
export interface MetaAccount {
  id: string;
  user_id: string;
  platform: 'facebook' | 'instagram';
  account_id: string;
  account_name: string;
  page_id?: string;
  page_name?: string;
  instagram_account_id?: string;
  permissions: string[];
  is_valid: boolean;
  last_error?: string;
  webhook_verified: boolean;
  access_token: string;
  token_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMessage {
  id: string;
  user_id: string;
  platform: 'facebook' | 'instagram';
  account_id: string;
  page_id?: string;
  sender_id: string;
  sender_name?: string;
  message_text?: string;
  message_type: string;
  external_message_id: string;
  thread_id?: string;
  direction: 'inbound' | 'outbound';
  status: 'read' | 'unread' | 'replied';
  is_read: boolean;
  reply_text?: string;
  replied_at?: string;
  received_at: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface WebhookConfig {
  id: string;
  user_id: string;
  platform: 'facebook' | 'instagram';
  account_id: string;
  webhook_id?: string;
  webhook_url?: string;
  subscription_fields: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OAuthResponse {
  success: boolean;
  authUrl?: string;
  state?: string;
  error?: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MetaApiError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}
