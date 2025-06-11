
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetaAuthRequest {
  code?: string;
  state?: string;
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

    const method = req.method;
    
    if (method === 'GET') {
      // Step 1: Initiate OAuth flow
      const clientId = Deno.env.get('META_APP_ID');
      const redirectUri = `${Deno.env.get('SITE_URL')}/social-media?auth=meta`;
      const state = crypto.randomUUID();
      
      if (!clientId) {
        throw new Error('META_APP_ID not configured');
      }

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,publish_actions&` +
        `response_type=code&` +
        `state=${state}`;

      return new Response(JSON.stringify({ url: authUrl, state }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      // Step 2: Handle OAuth callback
      const { code, state }: MetaAuthRequest = await req.json();
      
      if (!code) {
        throw new Error('No authorization code provided');
      }

      const clientId = Deno.env.get('META_APP_ID');
      const clientSecret = Deno.env.get('META_APP_SECRET');
      const redirectUri = `${Deno.env.get('SITE_URL')}/social-media?auth=meta`;

      if (!clientId || !clientSecret) {
        throw new Error('Meta credentials not configured');
      }

      // Exchange code for access token
      const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${clientId}&` +
        `client_secret=${clientSecret}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `code=${code}`);

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        throw new Error(`Meta OAuth error: ${tokenData.error.message}`);
      }

      // Get user's pages and Instagram accounts
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}&fields=id,name,access_token,instagram_business_account`
      );
      
      const pagesData = await pagesResponse.json();
      const accounts = [];

      // Process Facebook pages
      for (const page of pagesData.data || []) {
        accounts.push({
          platform: 'facebook',
          account_id: page.id,
          account_name: page.name,
          access_token: page.access_token,
          token_expires_at: tokenData.expires_in ? 
            new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
          user_id: user.id
        });

        // Check for connected Instagram account
        if (page.instagram_business_account) {
          const igResponse = await fetch(
            `https://graph.facebook.com/v18.0/${page.instagram_business_account.id}?access_token=${page.access_token}&fields=id,name,username`
          );
          const igData = await igResponse.json();

          if (!igData.error) {
            accounts.push({
              platform: 'instagram',
              account_id: igData.id,
              account_name: igData.username || igData.name,
              access_token: page.access_token,
              token_expires_at: tokenData.expires_in ? 
                new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
              user_id: user.id
            });
          }
        }
      }

      return new Response(JSON.stringify({ accounts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Method ${method} not allowed`);

  } catch (error) {
    console.error('Meta auth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
