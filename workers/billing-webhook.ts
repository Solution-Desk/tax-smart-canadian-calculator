// Cloudflare Worker for handling Lemon Squeezy webhooks
export interface Env {
  LEMON_SQUEEZY_WEBHOOK_SECRET: string
  CLERK_SECRET_KEY: string
}

interface LemonSqueezyWebhook {
  meta: {
    event_name: string
    custom_data: {
      user_id: string
      plan: string
    }
  }
  data: {
    id: string
    attributes: {
      status: string
      customer_id: string
      product_id: string
      variant_id: string
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Verify webhook signature
    const signature = request.headers.get('X-Signature')
    if (!signature) {
      return new Response('Missing signature', { status: 401 })
    }

    const body = await request.text()
    const expectedSignature = await generateSignature(body, env.LEMON_SQUEEZY_WEBHOOK_SECRET)
    
    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    const webhook: LemonSqueezyWebhook = JSON.parse(body)
    
    try {
      await handleWebhook(webhook, env)
      return new Response('OK', { status: 200 })
    } catch (error) {
      console.error('Webhook processing failed:', error)
      return new Response('Internal error', { status: 500 })
    }
  }
}

async function generateSignature(body: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function handleWebhook(webhook: LemonSqueezyWebhook, env: Env) {
  const { event_name, custom_data } = webhook.meta
  const { user_id, plan } = custom_data
  const { status } = webhook.data.attributes

  // Update user metadata in Clerk based on subscription status
  const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${user_id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_metadata: {
        plan: status === 'active' ? 'pro' : 'free',
        subscription_id: webhook.data.id,
        subscription_status: status,
        updated_at: new Date().toISOString(),
      }
    })
  })

  if (!clerkResponse.ok) {
    throw new Error(`Failed to update user metadata: ${clerkResponse.statusText}`)
  }

  console.log(`Updated user ${user_id} plan to ${status === 'active' ? 'pro' : 'free'}`)
}
