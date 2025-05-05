
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const metaAppId = Deno.env.get('META_APP_ID') || '';
const metaAppSecret = Deno.env.get('META_APP_SECRET') || '';
const redirectUri = Deno.env.get('META_REDIRECT_URI') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code) {
      // Generate OAuth URL
      const authorizationUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
      const randomState = crypto.randomUUID();
      
      authorizationUrl.searchParams.append('client_id', metaAppId);
      authorizationUrl.searchParams.append('redirect_uri', redirectUri);
      authorizationUrl.searchParams.append('state', randomState);
      authorizationUrl.searchParams.append('scope', 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts');
      
      return Response.json({
        url: authorizationUrl.toString(),
        state: randomState
      }, { headers: corsHeaders });
    }
    
    // Exchange code for access token
    const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
    const params = new URLSearchParams({
      client_id: metaAppId,
      client_secret: metaAppSecret,
      redirect_uri: redirectUri,
      code: code
    });
    
    const tokenResponse = await fetch(`${tokenUrl}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }
    
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;
    
    // Get user's Facebook accounts (pages)
    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();
    
    if (pagesData.error) {
      throw new Error(pagesData.error.message);
    }
    
    // Get Instagram accounts connected to the pages
    const accounts = [];
    
    for (const page of pagesData.data) {
      // Add Facebook page
      accounts.push({
        platform: 'facebook',
        account_id: page.id,
        account_name: page.name,
        access_token: page.access_token,
        token_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString()
      });
      
      // Check if this page has an Instagram account
      const instagramUrl = `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`;
      const instagramResponse = await fetch(instagramUrl);
      const instagramData = await instagramResponse.json();
      
      if (instagramData.instagram_business_account) {
        // Get Instagram account details
        const igAccountUrl = `https://graph.facebook.com/v18.0/${instagramData.instagram_business_account.id}?fields=name,username&access_token=${page.access_token}`;
        const igAccountResponse = await fetch(igAccountUrl);
        const igAccountData = await igAccountResponse.json();
        
        accounts.push({
          platform: 'instagram',
          account_id: instagramData.instagram_business_account.id,
          account_name: igAccountData.username || igAccountData.name || 'Instagram Account',
          access_token: page.access_token, // Use the page token for Instagram API calls
          token_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString()
        });
      }
    }
    
    if (accounts.length === 0) {
      throw new Error('No Facebook Pages or Instagram Business accounts found');
    }
    
    return Response.json({ accounts }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { 
      status: 400,
      headers: corsHeaders 
    });
  }
});
