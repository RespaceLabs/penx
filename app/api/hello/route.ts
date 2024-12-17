import { getServerSession } from '@/lib/session'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { env } = getRequestContext()
  const session = await getServerSession()
  const tasks = []

  // prompt - simple completion style input
  let simple = {
    prompt: 'Tell me a joke about Cloudflare',
  }
  let response = await env.AI.run('@cf/meta/llama-3-8b-instruct', simple)
  tasks.push({ inputs: simple, response })

  // messages - chat style input
  let chat: AiTextGenerationInput = {
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Who won the world series in 2020?' },
    ],
  }
  response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat)
  tasks.push({ inputs: chat, response })

  return Response.json({
    tasks,
    foo: 'bar',
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    CF_USER_API_TOKEN: process.env.CF_USER_API_TOKEN,
    DB_PREVIEW_DATABASE_ID: process.env.DB_PREVIEW_DATABASE_ID,
    DB_PROD_DATABASE_ID: process.env.DB_PROD_DATABASE_ID,
    password: env.SESSION_PASSWORD,
    // session,
  })
}
