import { authRouter } from './router/auth'
import { extensionRouter } from './router/extension'
import { githubRouter } from './router/github'
import { pageRouter } from './router/page'
import { SharedDocRouter } from './router/SharedDoc'
import { snapshotRouter } from './router/snapshot'
import { spaceRouter } from './router/space'
import { themeRouter } from './router/theme'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  space: spaceRouter,
  user: userRouter,
  auth: authRouter,
  page: pageRouter,
  theme: themeRouter,
  github: githubRouter,
  sharedDoc: SharedDocRouter,
  extension: extensionRouter,
  snapshot: snapshotRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
