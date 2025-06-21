
import { supabase } from '@/integrations/supabase/client';

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

export const initiateMetaOAuth = async (): Promise<{ authUrl: string; state: string } | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('meta-oauth', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: new URLSearchParams({ action: 'get_auth_url' })
    });

    if (error) {
      console.error('Error initiating Meta OAuth:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to initiate Meta OAuth:', error);
    return null;
  }
};

export const fetchConnectedAccounts = async (): Promise<MetaAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connected accounts:', error);
      return [];
    }

    return data as MetaAccount[];
  } catch (error) {
    console.error('Failed to fetch connected accounts:', error);
    return [];
  }
};

export const disconnectAccount = async (accountId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_media_accounts')
      .delete()
      .eq('id', accountId);

    if (error) {
      console.error('Error disconnecting account:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to disconnect account:', error);
    return false;
  }
};

export const fetchMessages = async (filters?: {
  platform?: 'facebook' | 'instagram';
  unreadOnly?: boolean;
  limit?: number;
}): Promise<SocialMessage[]> => {
  try {
    let query = supabase
      .from('social_media_messages')
      .select('*')
      .order('received_at', { ascending: false });

    if (filters?.platform) {
      query = query.eq('platform', filters.platform);
    }

    if (filters?.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data as SocialMessage[];
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
};

export const sendMessage = async (
  platform: 'facebook' | 'instagram',
  accountId: string,
  recipientId: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('meta-send-message', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: {
        platform,
        accountId,
        recipientId,
        message,
        messageType: 'text'
      }
    });

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: error.message };
  }
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_media_messages')
      .update({ is_read: true, status: 'read' })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to mark message as read:', error);
    return false;
  }
};

export const getUnreadCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('social_media_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('direction', 'inbound');

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
};

// Real-time subscription for new messages
export const subscribeToMessages = (
  onMessage: (message: SocialMessage) => void,
  onError?: (error: any) => void
) => {
  const channel = supabase
    .channel('social-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'social_media_messages'
      },
      (payload) => {
        onMessage(payload.new as SocialMessage);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to real-time messages');
      } else if (status === 'CLOSED') {
        console.log('Real-time subscription closed');
      } else if (status === 'CHANNEL_ERROR' && onError) {
        onError(status);
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
};
