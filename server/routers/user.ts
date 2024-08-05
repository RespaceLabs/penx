import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import ky from 'ky'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

interface EthPriceResponse {
  data: {
    currency: string
    rates: Record<string, string>
  }
}

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return [] as User[]
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return {} as User
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as User
    }),

  ethPrice: publicProcedure.query(async ({ ctx }) => {
    return 0 as number
  }),
})
