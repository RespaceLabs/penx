import { prisma } from '@/lib/prisma'
import ky from 'ky'
import { z } from 'zod'
import { getEthPrice } from '../lib/getEthPrice'
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

  getAddressByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { address = '' } = await prisma.user.findUniqueOrThrow({
        where: { id: input },
        select: { address: true },
      })
      return address
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

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
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
