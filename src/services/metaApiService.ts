
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MetaAccount {
  id: string;
  name: string;
  type: 'facebook' | 'whatsapp';
  connected: boolean;
  access_token?: string;
}

export interface MetaAuthResponse {
  success: boolean;
  authUrl?: string;
  error?: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'document';
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

// Initiate Meta OAuth flow
export const initiateFacebookAuth = async (): Promise<MetaAuthResponse> => {
  try {
    console.log('Initiating Facebook OAuth...');
    
    // This would typically call a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('meta-auth-init');
    
    if (error) {
      console.error('Meta auth error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, authUrl: data.authUrl };
  } catch (error) {
    console.error('Failed to initiate Meta auth:', error);
    return { success: false, error: error.message };
  }
};

// Get connected Meta accounts
export const getConnectedMetaAccounts = async (): Promise<MetaAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .select('*')
      .in('platform', ['facebook', 'instagram']);
    
    if (error) {
      console.error('Error fetching Meta accounts:', error);
      return [];
    }
    
    return (data || []).map(account => ({
      id: account.id,
      name: account.account_name,
      type: account.platform as 'facebook',
      connected: true,
      access_token: account.access_token
    }));
  } catch (error) {
    console.error('Failed to fetch Meta accounts:', error);
    return [];
  }
};

// Send WhatsApp message
export const sendWhatsAppMessage = async (
  to: string, 
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Sending WhatsApp message to:', to);
    
    const { data, error } = await supabase.functions.invoke('whatsapp-send', {
      body: { to, message }
    });
    
    if (error) {
      console.error('WhatsApp send error:', error);
      return { success: false, error: error.message };
    }
    
    toast({
      title: 'הודעה נשלחה',
      description: 'ההודעה נשלחה בהצלחה ב-WhatsApp',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return { success: false, error: error.message };
  }
};

// Get WhatsApp messages
export const getWhatsAppMessages = async (): Promise<WhatsAppMessage[]> => {
  try {
    // This would fetch from your WhatsApp Business API
    const { data, error } = await supabase.functions.invoke('whatsapp-messages');
    
    if (error) {
      console.error('Error fetching WhatsApp messages:', error);
      return [];
    }
    
    return data.messages || [];
  } catch (error) {
    console.error('Failed to fetch WhatsApp messages:', error);
    return [];
  }
};

// Create Facebook post
export const createFacebookPost = async (
  accountId: string,
  content: string,
  imageUrl?: string
): Promise<{ success: boolean; error?: string; postId?: string }> => {
  try {
    console.log('Creating Facebook post for account:', accountId);
    
    const { data, error } = await supabase.functions.invoke('meta-publish', {
      body: {
        platform: 'facebook',
        accountId,
        content,
        imageUrl
      }
    });
    
    if (error) {
      console.error('Facebook post error:', error);
      return { success: false, error: error.message };
    }
    
    toast({
      title: 'פוסט פורסם',
      description: 'הפוסט פורסם בהצלחה בפייסבוק',
    });
    
    return { success: true, postId: data.postId };
  } catch (error) {
    console.error('Failed to create Facebook post:', error);
    return { success: false, error: error.message };
  }
};
