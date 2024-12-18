import { getServerSession } from '@/lib/session'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

interface CreateContextOptions {
  // session: Session | null
}

type Token = {
  name: string
  uid: string
  role: string
  address: string
  email: string
  accessToken: string
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
  const session = await getServerSession()

  return {
    token: {
      uid: session?.userId || '',
      role: session?.role || '',
      address: session?.address || '',
    } as Token,
  }
}
