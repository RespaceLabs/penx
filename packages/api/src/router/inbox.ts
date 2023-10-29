import { Octokit } from 'octokit'
import { z } from 'zod'
import { getTokenByAddress } from '../service/getTokenByAddress'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const inboxRouter = createTRPCRouter({
  addText: publicProcedure
    .input(
      z.object({
        address: z.string(),
        spaceId: z.string(),
        text: z.string(),
        encryptionKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getTokenByAddress(input.address)
      const app = new Octokit({ auth: token })
      console.log('token....xx..:', token)
    }),

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
