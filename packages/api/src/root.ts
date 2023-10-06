import { authRouter } from './router/auth'
import { docRouter } from './router/doc'
import { extensionRouter } from './router/extension'
import { githubRouter } from './router/github'
import { memberRouter } from './router/member'
import { pageRouter } from './router/page'
import { SharedDocRouter } from './router/SharedDoc'
import { spaceRouter } from './router/space'
import { themeRouter } from './router/theme'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  doc: docRouter,
  space: spaceRouter,
  member: memberRouter,
  user: userRouter,
  auth: authRouter,
  page: pageRouter,
  theme: themeRouter,
  github: githubRouter,
  sharedDoc: SharedDocRouter,
  extension: extensionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
