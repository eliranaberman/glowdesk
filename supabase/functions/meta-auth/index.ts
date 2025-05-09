
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const FACEBOOK_APP_ID = Deno.env.get('FACEBOOK_APP_ID') || '';
const FACEBOOK_APP_SECRET = Deno.env.get('FACEBOOK_APP_SECRET') || '';
const REDIRECT_URI = Deno.env.get('META_REDIRECT_URI') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

console.log('Meta auth function initialized');

serve(async (req) => {
  console.log('Received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Check if required environment variables are set
    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET || !REDIRECT_URI) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({
          error: 'Server configuration error. Please check your environment variables.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Handle code exchange
    if (req.method === 'POST') {
      console.log('Processing POST request (code exchange)');
      
      const { code, state } = await req.json();
      
      if (!code || !state) {
        return new Response(
          JSON.stringify({ error: 'Missing code or state parameter' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      // Exchange the code for an access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
          REDIRECT_URI
        )}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        console.error('Error exchanging code for token:', tokenData.error);
        return new Response(
          JSON.stringify({
            error: 'Failed to exchange code for access token',
            details: tokenData.error,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      const accessToken = tokenData.access_token;
      
      // Get user accounts
      const accountsResponse = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=name,access_token&access_token=${accessToken}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const accountsData = await accountsResponse.json();
      
      if (accountsData.error) {
        console.error('Error fetching accounts:', accountsData.error);
        return new Response(
          JSON.stringify({
            error: 'Failed to fetch pages',
            details: accountsData.error,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      // Get Instagram business accounts connected to Facebook pages
      const accounts = [];
      
      // First, add Facebook pages
      for (const page of accountsData.data || []) {
        accounts.push({
          platform: 'facebook',
          account_id: page.id,
          account_name: page.name,
          access_token: page.access_token,
          token_expires_at: null, // Page tokens don't expire unless revoked
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        
        // For each page, get connected Instagram business account
        try {
          const instagramResponse = await fetch(
            `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account{id,name,username}&access_token=${page.access_token}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          const instagramData = await instagramResponse.json();
          
          if (instagramData.instagram_business_account) {
            const igAccount = instagramData.instagram_business_account;
            
            // Get more details about Instagram account
            const igDetailsResponse = await fetch(
              `https://graph.facebook.com/v19.0/${igAccount.id}?fields=name,username&access_token=${page.access_token}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            
            const igDetails = await igDetailsResponse.json();
            
            accounts.push({
              platform: 'instagram',
              account_id: igAccount.id,
              account_name: igDetails.username || igAccount.username || `Instagram Account ${igAccount.id}`,
              access_token: page.access_token, // Use the parent page's access token
              token_expires_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        } catch (igError) {
          console.error('Error fetching Instagram account for page:', page.id, igError);
          // Continue with other pages even if one fails
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          accounts,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // Initiate auth flow
    else {
      console.log('Initiating auth flow');
      // Generate a random state for CSRF protection
      const state = crypto.randomUUID();
      
      // Build the authorization URL
      const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&state=${state}&scope=pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish`;
      
      return new Response(
        JSON.stringify({
          url: authUrl,
          state,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
