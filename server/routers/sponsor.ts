import { Sponsor } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const sponsorRouter = router({
  listBySpaceId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return [] as (Sponsor & {
      user: {
        name: string | null
        ensName: string | null
        email: string | null
        address: string
      }
    })[]
  }),

  mySponsorBySpaceId: publicProcedure
    .input(
      z.object({
        spaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return {} as Sponsor
    }),

  getSponsorInSpace: publicProcedure
    .input(
      z.object({
        spaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return {} as Sponsor | undefined
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        spaceId: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
