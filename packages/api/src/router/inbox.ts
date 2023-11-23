import { Octokit } from 'octokit'
import { z } from 'zod'
import { decryptString, encryptString } from '@penx/encryption'
import { getNewNode } from '@penx/local-db'
import { User } from '@penx/model'
import { INode } from '@penx/model-types'
import { getTokenByInstallationId } from '../service/getTokenByInstallationId'
import { createTRPCRouter, publicProcedure } from '../trpc'

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}

export const inboxRouter = createTRPCRouter({
  addMarkdown: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //
    }),
})
