
import { supabase } from '@/integrations/supabase/client';
import { 
  SocialMediaAccount, 
  SocialMediaPost, 
  ConnectAccountResponse,
  FetchPostsResponse,
  CreatePostResponse,
  PostFormData
} from '@/types/socialMedia';

export const initiateMetaAuth = async (): Promise<{ url: string; state: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('meta-auth');
    
    if (error) {
      console.error('Error initiating Meta auth:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to initiate Meta auth:', error);
    return null;
  }
};

export const completeMetaAuth = async (code: string, state: string): Promise<ConnectAccountResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('meta-auth', {
      body: { code, state }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data.error) {
      return { success: false, error: data.error };
    }
    
    // Store accounts in Supabase
    const accounts = data.accounts;
    
    for (const account of accounts) {
      // Check if account already exists
      const { data: existingAccount } = await supabase
        .from('social_media_accounts')
        .select('id')
        .eq('account_id', account.account_id)
        .eq('platform', account.platform)
        .single();
      
      if (existingAccount) {
        // Update existing account
        await supabase
          .from('social_media_accounts')
          .update({
            access_token: account.access_token,
            token_expires_at: account.token_expires_at,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAccount.id);
      } else {
        // Create new account
        await supabase
          .from('social_media_accounts')
          .insert({
            ...account,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to complete Meta auth:', error);
    return { success: false, error: error.message };
  }
};

export const fetchConnectedAccounts = async (): Promise<SocialMediaAccount[]> => {
  try {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching connected accounts:', error);
      return [];
    }
    
    return (data || []) as SocialMediaAccount[];
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

export const fetchPosts = async (
  platform: 'facebook' | 'instagram',
  accountId: string
): Promise<FetchPostsResponse> => {
  try {
    // First fetch posts from our database
    const { data: localPosts, error: localError } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('platform', platform)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });
    
    if (localError) {
      console.error('Error fetching local posts:', localError);
      return { success: false, error: localError.message };
    }
    
    // Then fetch posts from Meta API
    try {
      const { data, error } = await supabase.functions.invoke('meta-posts', {
        body: { action: 'fetch_posts', platform, accountId }
      });
      
      if (error) {
        console.error('Error fetching posts from API:', error);
        // Still return local posts if API fetch fails
        return { success: true, posts: localPosts as SocialMediaPost[] };
      }
      
      if (data.error) {
        console.error('API returned error:', data.error);
        return { success: true, posts: localPosts as SocialMediaPost[] };
      }
      
      // Merge remote posts with local posts
      const remotePosts = data.posts || [];
      
      // Store any new remote posts in our database
      for (const post of remotePosts) {
        const exists = localPosts.some(p => p.external_post_id === post.external_post_id);
        
        if (!exists) {
          await supabase
            .from('social_media_posts')
            .insert({
              ...post,
              user_id: (await supabase.auth.getUser()).data.user?.id
            });
        }
      }
      
      // Refresh local posts after storing new ones
      const { data: updatedPosts } = await supabase
        .from('social_media_posts')
        .select('*')
        .eq('platform', platform)
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      
      return { success: true, posts: updatedPosts as SocialMediaPost[] || [] };
    } catch (apiError) {
      console.error('API fetch failed:', apiError);
      // Still return local posts if API fetch fails
      return { success: true, posts: localPosts as SocialMediaPost[] };
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { success: false, error: error.message };
  }
};

export const createPost = async (formData: PostFormData): Promise<CreatePostResponse> => {
  try {
    // First upload the image to Supabase Storage
    let imageUrl = '';
    
    if (formData.image) {
      const fileName = `${Date.now()}-${formData.image.name.replace(/\s+/g, '-')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('social-media')
        .upload(fileName, formData.image);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { success: false, error: uploadError.message };
      }
      
      // Get the public URL
      const { data } = supabase.storage.from('social-media').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }
    
    // Publish the post using the Meta API
    const { data, error } = await supabase.functions.invoke('meta-publish', {
      body: {
        platform: formData.platform,
        accountId: formData.account_id,
        caption: formData.caption,
        imageUrl,
        scheduledFor: formData.scheduled_for
      }
    });
    
    if (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
    
    if (data.error) {
      console.error('API returned error:', data.error);
      return { success: false, error: data.error };
    }
    
    return { success: true, post: data.post as SocialMediaPost };
  } catch (error) {
    console.error('Failed to create post:', error);
    return { success: false, error: error.message };
  }
};

export const deleteDraftPost = async (postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_media_posts')
      .delete()
      .eq('id', postId)
      .eq('status', 'draft');
    
    if (error) {
      console.error('Error deleting draft post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete draft post:', error);
    return false;
  }
};
