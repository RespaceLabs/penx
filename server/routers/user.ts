import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { getEthPrice } from '../lib/getEthPrice'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  contributors: publicProcedure.query(async ({ ctx }) => {
    return prisma.user.findMany({
      where: {
        OR: [{ role: UserRole.ADMIN }, { role: UserRole.AUTHOR }],
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

  addContributor: protectedProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const admin = await prisma.user.findFirstOrThrow({
        where: { id: ctx.token.uid },
      })
      if (admin.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can update contributor',
        })
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ address: input.q }, { email: input.q }],
        },
      })
      if (!user) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User not found, please check the address or email',
        })
      }
      if (user.role !== UserRole.READER) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User is a contributor already!',
        })
      }
      return prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.AUTHOR },
      })
    }),

  updateContributor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(UserRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: ctx.token.uid },
      })
      if (user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can update contributor',
        })
      }

      return prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })
    }),

  deleteContributor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: ctx.token.uid },
      })
      if (user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can remove contributor',
        })
      }

      if (ctx.token.uid === input.userId) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Cannot remove yourself',
        })
      }

      return prisma.user.update({
        where: { id: input.userId },
        data: { role: UserRole.READER },
      })
    }),

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
  }),
})
