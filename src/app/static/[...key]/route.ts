import { NETWORK } from '@/lib/constants'
import { getBasePublicClient } from '@/lib/getBasePublicClient'
import { getServerSession } from '@/lib/session'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function PUT(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.isLoggedIn) {
    return new Response('Unauthorized', { status: 401 })
  }
  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/static\//, '')
  const { env } = getRequestContext()

  try {
    const res = await env.penx_bucket.put(key, request.body)

    return Response.json({
      ...res,
      msg: `Put ${key} successfully!`,
      key: key,
    })
  } catch (error: any) {
    return Response.json({
      ok: false,
      error: error.toString(),
    })
  }
}

// read session
export async function GET(request: NextRequest) {
  const { env } = getRequestContext()
  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/static\//, '')

  const object = await env.penx_bucket.get(key)

  if (object === null) {
    return new Response('Object Not Found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)

  return new Response(object.body, {
    headers,
  })
}

// logout
export async function DELETE(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.isLoggedIn) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { env } = getRequestContext()
  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/static\//, '')
  await env.penx_bucket.delete(key)
  return new Response('Deleted!')
}

export async function POST(request: NextRequest) {
  return Response.json({
    foo: 'bar',
  })
}
