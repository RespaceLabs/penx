import { prisma } from '@/lib/prisma'
import Redis from 'ioredis'
import ky from 'ky'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

interface EthPriceResponse {
  price: number
}

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({ where: { id: ctx.token.uid } })
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
      return prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          ...input,
        },
      })
    }),

  ethPrice: publicProcedure.query(async ({ ctx }) => {
    const cacheKey = 'ETHUSDT_PRICE'
    const cacheTTL = 30 //  30s
    try {
      const cachedPrice = await redis.get(cacheKey)
      if (cachedPrice) return parseFloat(cachedPrice)

      const response = await ky
        .get('https://cache.bodhi.wtf/etherprice')
        .json<EthPriceResponse>()

      const ethPrice = response.price
      await redis.set(cacheKey, ethPrice.toString(), 'EX', cacheTTL)

      return ethPrice
    } catch (error) {
      console.error('Error fetching ETH price:', error)
      throw new Error('Failed to fetch ETH price')
    }
  }),
})
