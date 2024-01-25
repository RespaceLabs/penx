import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const personalTokenRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  myPersonalTokens: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.personalToken.findMany({
      where: { userId: ctx.token.uid },
    })
  }),

  create: protectedProcedure
    .input(z.object({ description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.personalToken.create({
        data: {
          ...input,
          userId: ctx.token.uid,
          value: nanoid(),
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        syncServerId: z.string().optional(),
        name: z.string().optional(),
        subdomain: z.string().optional(),
        description: z.string().optional(),
        catalogue: z.string().optional(),
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
