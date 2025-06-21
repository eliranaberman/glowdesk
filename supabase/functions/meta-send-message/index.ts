
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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

    const { platform, accountId, recipientId, message, messageType = 'text' } = await req.json()

    // Get account and access token
    const { data: account, error: accountError } = await supabase
      .from('social_media_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .eq('account_id', accountId)
      .single()

    if (accountError || !account) {
      return new Response(JSON.stringify({ error: 'Account not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let apiResponse
    let messageId

    if (platform === 'facebook') {
      // Send Facebook Messenger message
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${account.access_token}`
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
          messaging_type: 'RESPONSE'
        })
      })

      apiResponse = await response.json()
      messageId = apiResponse.message_id

    } else if (platform === 'instagram') {
      // Send Instagram DM
      const response = await fetch(`https://graph.facebook.com/v18.0/${account.instagram_account_id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${account.access_token}`
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message }
        })
      })

      apiResponse = await response.json()
      messageId = apiResponse.message_id
    }

    if (apiResponse.error) {
      return new Response(JSON.stringify({ error: apiResponse.error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Store outbound message
    const { error: storeError } = await supabase.from('social_media_messages').insert({
      user_id: user.id,
      platform,
      account_id: accountId,
      page_id: account.page_id,
      sender_id: accountId,
      sender_name: account.account_name,
      message_text: message,
      message_type: messageType,
      external_message_id: messageId,
      thread_id: recipientId,
      direction: 'outbound',
      status: 'sent',
      is_read: true,
      received_at: new Date().toISOString()
    })

    if (storeError) {
      console.error('Error storing outbound message:', storeError)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      messageId,
      response: apiResponse 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Send message error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
