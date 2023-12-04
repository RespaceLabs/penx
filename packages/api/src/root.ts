import { authRouter } from './router/auth'
import { extensionRouter } from './router/extension'
import { githubRouter } from './router/github'
import { nodeRouter } from './router/node'
import { sharedDocRouter } from './router/shared-doc'
import { spaceRouter } from './router/space'
import { spaceInvitationCodeRouter } from './router/space-invitation-code'
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
  sharedDoc: sharedDocRouter,
  extension: extensionRouter,
  spaceInvitationCode: spaceInvitationCodeRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
