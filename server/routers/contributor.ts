import { Contributor } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const contributorRouter = router({
  listBySpaceId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return [] as (Contributor & {
        user: {
          id: string
          name: string | null
          ensName: string | null
          email: string | null
          address: string
        }
      })[]
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return {} as Contributor
  }),

  create: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        address: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as Contributor
    }),

  transferShares: protectedProcedure
    .input(
      z.object({
        toId: z.string(),
        fromId: z.string(),
        fromShares: z.string(),
        toShares: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
