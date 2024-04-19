import { authRouter } from './router/auth'
import { bountyRouter } from './router/bounty'
import { cliRouter } from './router/cli'
import { extensionRouter } from './router/extension'
import { githubRouter } from './router/github'
import { googleRouter } from './router/google'
import { nodeRouter } from './router/node'
import { personalTokenRouter } from './router/personalToken'
import { spaceRouter } from './router/space'
import { syncServerRouter } from './router/syncServer'
import { tagTemplateRouter } from './router/tagTemplate'
import { taskRouter } from './router/task'
import { themeRouter } from './router/theme'
import { translatorRouter } from './router/translator'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  space: spaceRouter,
  user: userRouter,
  auth: authRouter,
  node: nodeRouter,
  theme: themeRouter,
  github: githubRouter,
  google: googleRouter,
  extension: extensionRouter,
  syncServer: syncServerRouter,
  personalToken: personalTokenRouter,
  task: taskRouter,
  bounty: bountyRouter,
  translator: translatorRouter,
  cli: cliRouter,
  tagTemplate: tagTemplateRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
