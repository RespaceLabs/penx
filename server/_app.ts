/**
 * This file contains the root router of your tRPC-backend
 */
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { channelRouter } from './routers/channel'
import { holderRouter } from './routers/holder'
import { memberRouter } from './routers/member'
import { messageRouter } from './routers/message'
import { postRouter } from './routers/post'
import { spaceRouter } from './routers/space'
import { sponsorRouter } from './routers/sponsor'
import { tradeRouter } from './routers/trade'
import { userRouter } from './routers/user'
import { createCallerFactory, publicProcedure, router } from './trpc'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => 'yay!'),
  user: userRouter,
  holder: holderRouter,
  post: postRouter,
  space: spaceRouter,
  channel: channelRouter,
  member: memberRouter,
  message: messageRouter,
  trade: tradeRouter,
  sponsor: sponsorRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
