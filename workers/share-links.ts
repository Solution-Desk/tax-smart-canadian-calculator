// Cloudflare Worker for secure share links and saved calculations
export interface Env {
  SHARE_LINKS: KVNamespace
  SAVED_CALCS: KVNamespace
  JWT_SECRET: string
}

interface ShareLinkData {
  id: string
  userId?: string
  calculationData: any
  isPrivate: boolean
  expiresAt: string
  createdAt: string
}

interface SavedCalculation {
  id: string
  userId: string
  name: string
  calculationData: any
  createdAt: string
  updatedAt: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      if (path.startsWith('/api/share')) {
        return handleShareLinks(request, env, corsHeaders)
      } else if (path.startsWith('/api/saved')) {
        return handleSavedCalculations(request, env, corsHeaders)
      }
      
      return new Response('Not found', { status: 404, headers: corsHeaders })
    } catch (error) {
      console.error('Worker error:', error)
      return new Response('Internal error', { status: 500, headers: corsHeaders })
    }
  }
}

async function handleShareLinks(request: Request, env: Env, corsHeaders: Record<string, string>) {
  const url = new URL(request.url)
  const method = request.method

  if (method === 'POST' && url.pathname === '/api/share/create') {
    const { calculationData, isPrivate, userId } = await request.json()
    
    const shareId = generateId()
    const expiresAt = new Date(Date.now() + (isPrivate ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString()
    
    const shareData: ShareLinkData = {
      id: shareId,
      userId: isPrivate ? userId : undefined,
      calculationData,
      isPrivate,
      expiresAt,
      createdAt: new Date().toISOString(),
    }

    await env.SHARE_LINKS.put(shareId, JSON.stringify(shareData), {
      expirationTtl: isPrivate ? 30 * 24 * 60 * 60 : 24 * 60 * 60
    })

    return new Response(JSON.stringify({ shareId, expiresAt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (method === 'GET' && url.pathname.startsWith('/api/share/')) {
    const shareId = url.pathname.split('/').pop()
    if (!shareId) {
      return new Response('Invalid share ID', { status: 400, headers: corsHeaders })
    }

    const shareDataStr = await env.SHARE_LINKS.get(shareId)
    if (!shareDataStr) {
      return new Response('Share link not found or expired', { status: 404, headers: corsHeaders })
    }

    const shareData: ShareLinkData = JSON.parse(shareDataStr)
    
    // Check if expired
    if (new Date() > new Date(shareData.expiresAt)) {
      await env.SHARE_LINKS.delete(shareId)
      return new Response('Share link expired', { status: 410, headers: corsHeaders })
    }

    return new Response(JSON.stringify(shareData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
}

async function handleSavedCalculations(request: Request, env: Env, corsHeaders: Record<string, string>) {
  const url = new URL(request.url)
  const method = request.method
  const userId = await getUserIdFromAuth(request)

  if (!userId) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  if (method === 'GET' && url.pathname === '/api/saved') {
    // List saved calculations for user
    const list = await env.SAVED_CALCS.list({ prefix: `user:${userId}:` })
    const calculations = await Promise.all(
      list.keys.map(async (key) => {
        const data = await env.SAVED_CALCS.get(key.name)
        return data ? JSON.parse(data) : null
      })
    )

    return new Response(JSON.stringify(calculations.filter(Boolean)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (method === 'POST' && url.pathname === '/api/saved') {
    const { name, calculationData } = await request.json()
    
    const calcId = generateId()
    const key = `user:${userId}:${calcId}`
    
    const savedCalc: SavedCalculation = {
      id: calcId,
      userId,
      name,
      calculationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await env.SAVED_CALCS.put(key, JSON.stringify(savedCalc))

    return new Response(JSON.stringify(savedCalc), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
}

async function getUserIdFromAuth(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  // In a real implementation, you'd verify the JWT token here
  // For now, we'll extract the user ID from the token payload
  const token = authHeader.slice(7)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub || payload.userId
  } catch {
    return null
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
