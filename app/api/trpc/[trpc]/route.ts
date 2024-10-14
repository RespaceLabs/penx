// // app/api/trpc/[trpc]/route.ts
import { appRouter } from '@/server/_app'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { getToken } from 'next-auth/jwt'
import cors from './cors'

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async ({ req }) => {
      let token = (await getToken({ req: req as any })) as any
      return { token }
    },
  })
  return cors(req, response)
}

export const maxDuration = 60 * 2

export { handler as GET, handler as POST }
