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

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.personalToken.delete({ where: { id: input } })
    }),
})
