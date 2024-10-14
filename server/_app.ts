/**
 * This file contains the root router of your tRPC-backend
 */
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { postRouter } from './routers/post'
import { siteRouter } from './routers/site'
import { tagRouter } from './routers/tag'
import { userRouter } from './routers/user'
import { createCallerFactory, publicProcedure, router } from './trpc'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => 'yay!'),
  site: siteRouter,
  user: userRouter,
  post: postRouter,
  tag: tagRouter,
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
