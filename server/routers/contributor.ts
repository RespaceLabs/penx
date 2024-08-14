import { Contributor } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const contributorRouter = router({
  listBySpaceId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return [] as (Contributor & {
        user: {
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
        share: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as Contributor
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        share: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
