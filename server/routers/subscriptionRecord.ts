import { TradeSource } from '@/lib/constants'
import { precision } from '@/lib/math'
import { prisma } from '@/lib/prisma'
import { SubscriptionRecord } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

enum SubscriptionType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export const subscriptionRecordRouter = router({
  listBySpaceId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return [] as (SubscriptionRecord & {
      user: {
        name: string | null
        ensName: string | null
        email: string | null
        address: string
      }
    })[]
  }),

  upsertSubscription: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        tradeDuration: z.number(),
        type: z.enum([
          SubscriptionType.SUBSCRIBE,
          SubscriptionType.UNSUBSCRIBE,
        ]),
        start: z.number(),
        checkpoint: z.number(),
        duration: z.number(),
        amount: z.string(),
        consumed: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
