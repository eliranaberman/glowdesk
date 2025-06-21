
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const metaAppSecret = Deno.env.get('META_APP_SECRET')!
const webhookVerifyToken = Deno.env.get('META_WEBHOOK_VERIFY_TOKEN') || 'your_verify_token_123'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    if (req.method === 'GET') {
      // Webhook verification
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode === 'subscribe' && token === webhookVerifyToken) {
        console.log('Webhook verified successfully')
        return new Response(challenge, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        })
      }

      return new Response('Forbidden', { status: 403 })
    }

    if (req.method === 'POST') {
      // Handle webhook events
      const signature = req.headers.get('x-hub-signature-256')
      const body = await req.text()

      // Verify webhook signature
      if (!verifyWebhookSignature(body, signature, metaAppSecret)) {
        return new Response('Unauthorized', { status: 401 })
      }

      const webhookData = JSON.parse(body)
      
      for (const entry of webhookData.entry || []) {
        // Handle Facebook Messenger messages
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            await handleMessengerEvent(supabase, entry.id, messagingEvent)
          }
        }

        // Handle Instagram messages
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              await handleInstagramEvent(supabase, entry.id, change.value)
            }
          }
        }
      }

      return new Response('OK', { status: 200 })
    }

    return new Response('Method not allowed', { status: 405 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

function verifyWebhookSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  
  const expectedSignature = 'sha256=' + 
    Array.from(new Uint8Array(
      new TextEncoder().encode(secret)
    )).map(b => b.toString(16).padStart(2, '0')).join('')
  
  return signature === expectedSignature
}

async function handleMessengerEvent(supabase: any, pageId: string, event: any) {
  try {
    // Find the user who owns this page
    const { data: accounts } = await supabase
      .from('social_media_accounts')
      .select('user_id, account_name')
      .eq('platform', 'facebook')
      .eq('page_id', pageId)

    if (!accounts || accounts.length === 0) {
      console.log('No account found for page:', pageId)
      return
    }

    const account = accounts[0]

    if (event.message && !event.message.is_echo) {
      // Incoming message
      const { error } = await supabase.from('social_media_messages').insert({
        user_id: account.user_id,
        platform: 'facebook',
        account_id: pageId,
        page_id: pageId,
        sender_id: event.sender.id,
        sender_name: 'Facebook User',
        message_text: event.message.text || '[Media message]',
        message_type: event.message.text ? 'text' : 'media',
        external_message_id: event.message.mid,
        thread_id: event.sender.id,
        direction: 'inbound',
        status: 'unread',
        is_read: false,
        received_at: new Date(event.timestamp).toISOString(),
        metadata: event
      })

      if (error) {
        console.error('Error storing Facebook message:', error)
      }
    }

    if (event.delivery) {
      // Message delivery confirmation
      await supabase
        .from('social_media_messages')
        .update({ status: 'delivered' })
        .in('external_message_id', event.delivery.mids || [])
    }

    if (event.read) {
      // Message read confirmation
      await supabase
        .from('social_media_messages')
        .update({ is_read: true, status: 'read' })
        .eq('thread_id', event.sender.id)
        .lte('received_at', new Date(event.read.watermark).toISOString())
    }

  } catch (error) {
    console.error('Error handling Messenger event:', error)
  }
}

async function handleInstagramEvent(supabase: any, pageId: string, event: any) {
  try {
    // Find the user who owns this Instagram account
    const { data: accounts } = await supabase
      .from('social_media_accounts')
      .select('user_id, account_name, instagram_account_id')
      .eq('platform', 'instagram')
      .eq('page_id', pageId)

    if (!accounts || accounts.length === 0) {
      console.log('No Instagram account found for page:', pageId)
      return
    }

    const account = accounts[0]

    if (event.message && event.from && event.from.id !== account.instagram_account_id) {
      // Incoming Instagram DM
      const { error } = await supabase.from('social_media_messages').insert({
        user_id: account.user_id,
        platform: 'instagram',
        account_id: account.instagram_account_id,
        page_id: pageId,
        sender_id: event.from.id,
        sender_name: event.from.username || 'Instagram User',
        message_text: event.message.text || '[Media message]',
        message_type: event.message.text ? 'text' : 'media',
        external_message_id: event.message.mid,
        thread_id: event.from.id,
        direction: 'inbound',
        status: 'unread',
        is_read: false,
        received_at: new Date(event.created_time).toISOString(),
        metadata: event
      })

      if (error) {
        console.error('Error storing Instagram message:', error)
      }
    }

  } catch (error) {
    console.error('Error handling Instagram event:', error)
  }
}
