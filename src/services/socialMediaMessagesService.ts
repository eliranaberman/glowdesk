
import { supabase } from '@/integrations/supabase/client';
import { SocialMediaMessage } from '@/components/social-media/types';

export const fetchUserMessages = async (): Promise<SocialMediaMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('social_media_messages')
      .select('*')
      .order('received_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
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

export const replyToMessage = async (messageId: string, replyText: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_media_messages')
      .update({ 
        reply_text: replyText,
        replied_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error saving reply:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to save reply:', error);
    return false;
  }
};

export const getUnreadMessagesCount = async (): Promise<number> => {
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
