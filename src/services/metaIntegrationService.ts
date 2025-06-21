
import { supabase } from '@/integrations/supabase/client';
import { MetaAccount, SocialMessage, OAuthResponse, SendMessageResponse } from '@/types/metaIntegration';

// Re-export types for backward compatibility
export type { MetaAccount, SocialMessage, OAuthResponse, SendMessageResponse };

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
    // Query only the columns that definitely exist in the current table
    const { data, error } = await supabase
      .from('social_media_accounts')
      .select(`
        id,
        user_id,
        platform,
        account_id,
        account_name,
        access_token,
        token_expires_at,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connected accounts:', error);
      return [];
    }

    // Transform database results to match MetaAccount interface with safe defaults
    return (data || []).map(account => ({
      id: account.id,
      user_id: account.user_id,
      platform: account.platform as 'facebook' | 'instagram',
      account_id: account.account_id,
      account_name: account.account_name,
      page_id: undefined, // Will be populated when columns exist
      page_name: undefined,
      instagram_account_id: undefined,
      permissions: [], // Default empty array
      is_valid: true, // Default to true
      last_error: undefined,
      webhook_verified: false, // Default to false
      access_token: account.access_token,
      token_expires_at: account.token_expires_at || undefined,
      created_at: account.created_at,
      updated_at: account.updated_at
    }));
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
    // Query only the columns that exist in the current table
    let query = supabase
      .from('social_media_messages')
      .select(`
        id,
        user_id,
        platform,
        account_id,
        sender_id,
        sender_name,
        message_text,
        message_type,
        external_message_id,
        thread_id,
        is_read,
        reply_text,
        replied_at,
        received_at,
        created_at,
        updated_at
      `)
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

    // Transform database results to match SocialMessage interface with safe defaults
    return (data || []).map(msg => ({
      id: msg.id,
      user_id: msg.user_id,
      platform: msg.platform as 'facebook' | 'instagram',
      account_id: msg.account_id,
      page_id: undefined, // Will be populated when column exists
      sender_id: msg.sender_id,
      sender_name: msg.sender_name || undefined,
      message_text: msg.message_text || undefined,
      message_type: msg.message_type,
      external_message_id: msg.external_message_id,
      thread_id: msg.thread_id || undefined,
      direction: 'inbound' as const, // Default value when column doesn't exist
      status: msg.is_read ? 'read' as const : 'unread' as const,
      is_read: msg.is_read,
      reply_text: msg.reply_text || undefined,
      replied_at: msg.replied_at || undefined,
      received_at: msg.received_at,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      metadata: undefined // Will be populated when column exists
    }));
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
): Promise<SendMessageResponse> => {
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

    return { success: true, messageId: data?.messageId };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_media_messages')
      .update({ is_read: true })
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
      .eq('is_read', false);

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
        const newMessage = payload.new;
        // Transform to match SocialMessage interface
        const socialMessage: SocialMessage = {
          id: newMessage.id,
          user_id: newMessage.user_id,
          platform: newMessage.platform as 'facebook' | 'instagram',
          account_id: newMessage.account_id,
          page_id: newMessage.page_id || undefined,
          sender_id: newMessage.sender_id,
          sender_name: newMessage.sender_name || undefined,
          message_text: newMessage.message_text || undefined,
          message_type: newMessage.message_type,
          external_message_id: newMessage.external_message_id,
          thread_id: newMessage.thread_id || undefined,
          direction: newMessage.direction || 'inbound',
          status: newMessage.status || (newMessage.is_read ? 'read' : 'unread'),
          is_read: newMessage.is_read,
          reply_text: newMessage.reply_text || undefined,
          replied_at: newMessage.replied_at || undefined,
          received_at: newMessage.received_at,
          created_at: newMessage.created_at,
          updated_at: newMessage.updated_at,
          metadata: newMessage.metadata
        };
        onMessage(socialMessage);
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
