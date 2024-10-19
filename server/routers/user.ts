import { prisma } from '@/lib/prisma'
import ky from 'ky'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

interface EthPriceResponse {
  price: number
}

// Helper function to set role
async function setRole(address: string, role: 'ADMIN' | 'AUTHOR' | 'READER') {
  if (!address) {
    throw new Error('Address cannot be empty')
  }

  const existingUser = await prisma.user.findUnique({
    where: { address },
  })

  if (existingUser) {
    return prisma.user.update({
      where: { address },
      data: { role },
    })
  } else {
    return prisma.user.create({
      data: {
        address,
        role,
      },
    })
  }
}

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  listAdminUsers: publicProcedure.query(async ({ ctx }) => {
    return prisma.user.findMany({
      where: {
        AND: {
          role: 'ADMIN',
        },
      },
    })
  }),

  listAuthorUsers: publicProcedure.query(async ({ ctx }) => {
    return prisma.user.findMany({
      where: {
        AND: {
          role: 'AUTHOR',
        },
      },
    })
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
      const response = await ky
        .get('https://cache.bodhi.wtf/etherprice')
        .json<EthPriceResponse>()

      const ethPrice = response.price

      return ethPrice
    } catch (error) {
      console.error('Error fetching ETH price:', error)
      throw new Error('Failed to fetch ETH price')
    }
  }),

  setRoleToAdmin: protectedProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .mutation(({ input }) => setRole(input.address, 'ADMIN')),

  setRoleToAuthor: protectedProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .mutation(({ input }) => setRole(input.address, 'AUTHOR')),

  setRoleToReader: protectedProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .mutation(({ input }) => setRole(input.address, 'READER')),
})
