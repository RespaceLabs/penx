import { prisma } from '@/lib/prisma'
import { AuthTokenClaims, PrivyClient } from '@privy-io/server-auth'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type * as trpcNext from '@trpc/server/adapters/next'
import { getToken } from 'next-auth/jwt'

interface CreateContextOptions {
  // session: Session | null
}

type Token = {
  name: string
  uid: string
  role: string
  address: string
  email: string
  sub: string
  iat: number
  exp: number
  jti: string
  accessToken: string
}

let secret = ''

async function getAuthSecret() {
  let nextAuthSecret = process.env.NEXTAUTH_SECRET
  if (nextAuthSecret) return nextAuthSecret
  if (secret) return secret

  const site = await prisma.site.findFirst({
    select: {
      authSecret: true,
    },
  })
  secret = site?.authSecret || ''
  return site?.authSecret || ''
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {}
}

export type Context = Awaited<ReturnType<typeof createContextInner>> & {
  token: Token
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  // for API-response caching see https://trpc.io/docs/v11/caching
  const { req } = opts

  const nextAuthSecret = await getAuthSecret()

  let token = (await getToken({
    req: req as any,
    secret: nextAuthSecret,
  })) as any
  return { token }
}
