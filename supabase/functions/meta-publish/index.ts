
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the user ID from the JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }
    
    const formData = await req.json();
    const { platform, accountId, caption, imageUrl, scheduledFor } = formData;
    
    // Get account access token
    const { data: account, error: accountError } = await supabase
      .from('social_media_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .eq('account_id', accountId)
      .single();
    
    if (accountError || !account) {
      throw new Error('Account not found or unauthorized');
    }
    
    // Prepare the post data based on platform
    let postData = {};
    let apiUrl = '';
    
    if (platform === 'facebook') {
      apiUrl = `https://graph.facebook.com/v18.0/${accountId}/photos`;
      postData = {
        url: imageUrl,
        caption: caption,
        published: scheduledFor ? false : true,
        access_token: account.access_token
      };
      
      if (scheduledFor) {
        const scheduledTime = Math.floor(new Date(scheduledFor).getTime() / 1000);
        postData['scheduled_publish_time'] = scheduledTime;
      }
      
    } else if (platform === 'instagram') {
      // For Instagram, first create a container
      apiUrl = `https://graph.facebook.com/v18.0/${accountId}/media`;
      postData = {
        image_url: imageUrl,
        caption: caption,
        access_token: account.access_token
      };
    }
    
    // Make the API request to create the post or container
    const formParams = new URLSearchParams();
    Object.entries(postData).forEach(([key, value]) => {
      formParams.append(key, String(value));
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formParams
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    // For Instagram, we need a second step to publish the container
    let externalPostId = data.id;
    let status = 'published';
    
    if (platform === 'instagram') {
      const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`;
      const publishParams = new URLSearchParams({
        creation_id: data.id,
        access_token: account.access_token
      });
      
      const publishResponse = await fetch(publishUrl, {
        method: 'POST',
        body: publishParams
      });
      
      const publishData = await publishResponse.json();
      
      if (publishData.error) {
        throw new Error(publishData.error.message);
      }
      
      externalPostId = publishData.id;
    }
    
    // Store the post in our database
    const { data: post, error: postError } = await supabase
      .from('social_media_posts')
      .insert({
        user_id: user.id,
        platform: platform,
        account_id: accountId,
        caption: caption,
        image_url: imageUrl,
        external_post_id: externalPostId,
        status: scheduledFor ? 'scheduled' : 'published',
        scheduled_for: scheduledFor,
        published_at: scheduledFor ? null : new Date().toISOString(),
      })
      .select()
      .single();
    
    if (postError) {
      throw new Error(`Failed to store post: ${postError.message}`);
    }
    
    return Response.json({ success: true, post }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { 
      status: 400,
      headers: corsHeaders 
    });
  }
});
