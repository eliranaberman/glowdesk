
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublishRequest {
  platform: 'facebook' | 'instagram';
  accountId: string;
  caption: string;
  imageUrl?: string;
  scheduledFor?: string;
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

    const { platform, accountId, caption, imageUrl, scheduledFor }: PublishRequest = await req.json();

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

    let postData: any = {};
    let publishUrl = '';

    if (platform === 'facebook') {
      publishUrl = `https://graph.facebook.com/v18.0/${accountId}/feed`;
      postData = {
        message: caption,
        access_token: account.access_token
      };

      if (imageUrl) {
        postData.link = imageUrl;
      }

      if (scheduledFor) {
        postData.scheduled_publish_time = Math.floor(new Date(scheduledFor).getTime() / 1000);
        postData.published = false;
      }
    } else if (platform === 'instagram') {
      // Instagram publishing is more complex - requires creating media object first
      if (!imageUrl) {
        throw new Error('Instagram posts require an image');
      }

      // Step 1: Create media object
      const mediaResponse = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          image_url: imageUrl,
          caption: caption,
          access_token: account.access_token
        })
      });

      const mediaData = await mediaResponse.json();
      
      if (mediaData.error) {
        throw new Error(`Instagram media creation error: ${mediaData.error.message}`);
      }

      // Step 2: Publish the media
      publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`;
      postData = {
        creation_id: mediaData.id,
        access_token: account.access_token
      };
    }

    const response = await fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(postData)
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(`Publishing error: ${result.error.message}`);
    }

    // Save the post to our database
    const postRecord = {
      external_post_id: result.id,
      account_id: accountId,
      platform,
      caption,
      image_url: imageUrl,
      status: scheduledFor ? 'scheduled' : 'published',
      scheduled_for: scheduledFor || null,
      published_at: scheduledFor ? null : new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id
    };

    const { data: savedPost, error: saveError } = await supabaseClient
      .from('social_media_posts')
      .insert(postRecord)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving post to database:', saveError);
    }

    return new Response(JSON.stringify({ 
      post: savedPost || postRecord,
      external_id: result.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Meta publish error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
