import { Trade } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

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

  create: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        type: z.enum([TradeType.BUY, TradeType.SELL]),
        amountIn: z.string(),
        amountOut: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
