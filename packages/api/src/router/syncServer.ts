import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const syncServerRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        subdomain: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        catalogue: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.space.update({ where: { id }, data })
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({ where: { spaceId: input } })
        return ctx.prisma.space.delete({ where: { id: input } })
      })
    }),
})
