import { Trade } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const tradeRouter = router({
  listBySpaceId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return [] as (Trade & {
      user: {
        name: string | null
        ensName: string | null
        email: string | null
        address: string
      }
    })[]
  }),

  listByPostId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return [] as (Trade & {
      user: {
        name: string | null
        ensName: string | null
        email: string | null
        address: string
      }
    })[]
  }),

  tradeSpaceKey: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        holdAmount: z.string(),
        tradeAmount: z.string(),
        price: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  tradePostKey: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        holdAmount: z.string(),
        tradeAmount: z.string(),
        price: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  tradeSponsorKey: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        holdAmount: z.string(),
        tradeAmount: z.string(),
        price: z.string(),
        type: z.string(),
        name: z.string().optional(),
        logo: z.string().optional(),
        homeUrl: z.string().optional(),
        cover: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
