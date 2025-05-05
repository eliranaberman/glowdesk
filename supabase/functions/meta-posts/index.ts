
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.9";

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
    
    const { action, platform, accountId } = await req.json();
    
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
    
    if (action === 'fetch_posts') {
      // Fetch posts from Meta API based on the platform
      const apiEndpoint = platform === 'instagram' 
        ? `https://graph.facebook.com/v18.0/${accountId}/media`
        : `https://graph.facebook.com/v18.0/${accountId}/posts`;
        
      const fields = platform === 'instagram'
        ? 'id,caption,media_url,timestamp,permalink'
        : 'id,message,full_picture,created_time,permalink_url';
        
      const url = `${apiEndpoint}?fields=${fields}&access_token=${account.access_token}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // Transform the data to match our schema
      const posts = data.data.map(post => {
        return {
          external_post_id: post.id,
          platform,
          account_id: accountId,
          caption: platform === 'instagram' ? post.caption : post.message,
          image_url: platform === 'instagram' ? post.media_url : post.full_picture,
          status: 'published',
          published_at: platform === 'instagram' ? post.timestamp : post.created_time,
        };
      });
      
      return Response.json({ posts }, { headers: corsHeaders });
    } else {
      throw new Error('Invalid action');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { 
      status: 400,
      headers: corsHeaders 
    });
  }
});
