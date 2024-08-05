import { Channel } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const channelRouter = router({
  listBySpaceId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return [] as Channel[]
    }),

  create: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as Channel
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //
    }),
})
