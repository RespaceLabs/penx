import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

export const accessTokenRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return prisma.accessToken.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),

  create: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        alias: z.string(),
        expiredAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const record = await prisma.accessToken.create({
        data: {
          token: input.token,
          alias: input.alias,
          userId: ctx.token.uid,
          expiredAt: input.expiredAt,
        },
      })
      return record
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.accessToken.delete({
        where: {
          id: input.id,
        },
      })
      return { success: true }
    }),
})
