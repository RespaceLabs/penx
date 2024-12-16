import { appRouter } from '@/server/_app'
import { createContext } from '@/server/context'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import cors from './cors'

export const runtime = 'edge'

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  })
  return cors(req, response)
}

export { handler as GET, handler as POST }
