import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const syncServerRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.syncServer.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.syncServer.create({
        data: {
          token: nanoid(),
          url: '',
          ...input,
          userId: ctx.token.uid,
        },
      })
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
