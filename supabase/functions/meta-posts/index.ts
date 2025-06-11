
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PostsRequest {
  action: 'fetch_posts';
  platform: 'facebook' | 'instagram';
  accountId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, platform, accountId }: PostsRequest = await req.json();

    if (action === 'fetch_posts') {
      // Get the account access token from our database
      const { data: account, error: accountError } = await supabaseClient
        .from('social_media_accounts')
        .select('access_token')
        .eq('account_id', accountId)
        .eq('platform', platform)
        .eq('user_id', user.id)
        .single();

      if (accountError || !account) {
        throw new Error('Account not found or access denied');
      }

      let postsUrl = '';
      let fields = '';

      if (platform === 'facebook') {
        fields = 'id,message,created_time,attachments{media{image}}';
        postsUrl = `https://graph.facebook.com/v18.0/${accountId}/posts?fields=${fields}&limit=10&access_token=${account.access_token}`;
      } else if (platform === 'instagram') {
        fields = 'id,caption,media_type,media_url,timestamp';
        postsUrl = `https://graph.facebook.com/v18.0/${accountId}/media?fields=${fields}&limit=10&access_token=${account.access_token}`;
      }

      const response = await fetch(postsUrl);
      const data = await response.json();

      if (data.error) {
        throw new Error(`API error: ${data.error.message}`);
      }

      // Transform the data to our format
      const posts = (data.data || []).map((post: any) => ({
        external_post_id: post.id,
        account_id: accountId,
        platform,
        caption: post.message || post.caption,
        image_url: platform === 'facebook' ? 
          post.attachments?.data?.[0]?.media?.image?.src : 
          post.media_url,
        status: 'published',
        published_at: post.created_time || post.timestamp,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id
      }));

      return new Response(JSON.stringify({ posts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Meta posts error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
