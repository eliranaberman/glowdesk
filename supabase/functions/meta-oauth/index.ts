
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const metaAppId = Deno.env.get('META_APP_ID')!
const metaAppSecret = Deno.env.get('META_APP_SECRET')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (action === 'get_auth_url') {
      // Generate OAuth URL
      const redirectUri = `${url.origin}/supabase/functions/v1/meta-oauth?action=callback`
      const state = `${user.id}_${Date.now()}`
      
      const scopes = [
        'pages_messaging',
        'pages_show_list', 
        'instagram_basic',
        'instagram_manage_messages',
        'pages_read_engagement',
        'business_management'
      ].join(',')

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${metaAppId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `state=${state}&` +
        `response_type=code`

      return new Response(JSON.stringify({ 
        authUrl,
        state 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'callback') {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      
      if (!code || !state) {
        return new Response('Missing parameters', { status: 400 })
      }

      // Extract user ID from state
      const userId = state.split('_')[0]
      
      // Exchange code for access token
      const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: metaAppId,
          client_secret: metaAppSecret,
          redirect_uri: `${url.origin}/supabase/functions/v1/meta-oauth?action=callback`,
          code
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (tokenData.error) {
        console.error('Token exchange error:', tokenData.error)
        return new Response(`Error: ${tokenData.error.message}`, { status: 400 })
      }

      // Get long-lived token
      const longLivedResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${metaAppId}&` +
        `client_secret=${metaAppSecret}&` +
        `fb_exchange_token=${tokenData.access_token}`
      )

      const longLivedData = await longLivedResponse.json()

      // Get user's pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedData.access_token}`
      )
      const pagesData = await pagesResponse.json()

      // Store accounts and tokens
      for (const page of pagesData.data || []) {
        // Get Instagram account connected to this page
        const instagramResponse = await fetch(
          `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
        )
        const instagramData = await instagramResponse.json()

        // Store Facebook Page
        const { error: fbError } = await supabase.from('social_media_accounts').upsert({
          user_id: userId,
          platform: 'facebook',
          account_id: page.id,
          account_name: page.name,
          page_id: page.id,
          page_name: page.name,
          access_token: page.access_token,
          permissions: ['pages_messaging', 'pages_show_list', 'pages_read_engagement'],
          is_valid: true,
          webhook_verified: false
        }, { 
          onConflict: 'user_id,account_id,platform' 
        })

        if (fbError) console.error('Facebook account storage error:', fbError)

        // Store Instagram account if connected
        if (instagramData.instagram_business_account) {
          const { error: igError } = await supabase.from('social_media_accounts').upsert({
            user_id: userId,
            platform: 'instagram',
            account_id: instagramData.instagram_business_account.id,
            account_name: page.name + ' (Instagram)',
            page_id: page.id,
            page_name: page.name,
            instagram_account_id: instagramData.instagram_business_account.id,
            access_token: page.access_token,
            permissions: ['instagram_basic', 'instagram_manage_messages'],
            is_valid: true,
            webhook_verified: false
          }, { 
            onConflict: 'user_id,account_id,platform' 
          })

          if (igError) console.error('Instagram account storage error:', igError)
        }

        // Store encrypted tokens
        const { error: tokenError } = await supabase.from('social_media_tokens').upsert({
          user_id: userId,
          account_id: page.id,
          platform: 'facebook',
          token_type: 'access_token',
          encrypted_token: page.access_token, // In production, encrypt this
          expires_at: longLivedData.expires_in ? 
            new Date(Date.now() + longLivedData.expires_in * 1000).toISOString() : null
        }, { 
          onConflict: 'user_id,account_id,platform,token_type' 
        })

        if (tokenError) console.error('Token storage error:', tokenError)
      }

      // Redirect to dashboard with success
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `${url.protocol}//${url.host}/social-media?connected=true`
        }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Meta OAuth error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
