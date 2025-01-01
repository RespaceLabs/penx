/**
 * This file contains the root router of your tRPC-backend
 */
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { accessTokenRouter } from './routers/access-token'
import { assetRouter } from './routers/asset'
import { blockRouter } from './routers/block'
import { commentRouter } from './routers/comment'
import { databaseRouter } from './routers/database'
import { googleRouter } from './routers/google'
import { pageRouter } from './routers/page'
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
  google: googleRouter,
  accessToken: accessTokenRouter,
  comment: commentRouter,
  asset: assetRouter,
  database: databaseRouter,
  page: pageRouter,
  block: blockRouter,
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
