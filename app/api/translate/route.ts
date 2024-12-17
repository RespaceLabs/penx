import { getServerSession } from '@/lib/session'
import { getRequestContext } from '@cloudflare/next-on-pages'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { env } = getRequestContext()
  const session = await getServerSession()

  const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
    text: "I'll have an order of the moule frites",
    source_lang: 'english', // defaults to english
    target_lang: 'french',
  })

  return Response.json(response)
}

export async function POST(request: NextRequest) {
  const { env } = getRequestContext()
  const session = await getServerSession()
  const json = (await request.json()) as {
    text: string
    sourceLang: string
    targetLang: string
  }

  const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
    text: json.text || 'Hello world',
    source_lang: json.sourceLang || 'english', // defaults to english
    target_lang: json.targetLang || 'french',
  })

  return Response.json({
    ...response,
    ...json,
  })
}
