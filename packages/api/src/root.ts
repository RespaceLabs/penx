import { authRouter } from './router/auth'
import { extensionRouter } from './router/extension'
import { githubRouter } from './router/github'
import { nodeRouter } from './router/node'
import { personalTokenRouter } from './router/personalToken'
import { spaceRouter } from './router/space'
import { syncServerRouter } from './router/syncServer'
import { themeRouter } from './router/theme'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  space: spaceRouter,
  user: userRouter,
  auth: authRouter,
  node: nodeRouter,
  theme: themeRouter,
  github: githubRouter,
  extension: extensionRouter,
  syncServer: syncServerRouter,
  personalToken: personalTokenRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
