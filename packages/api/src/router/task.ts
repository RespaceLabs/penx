import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const taskRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      orderBy: { createdAt: 'asc' },
    })
  }),

  myTask: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
    })
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findUniqueOrThrow({
        where: { id: input.id },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        status: z.string(),
        description: z.string().optional(),
        tags: z.string().optional(),
        figmaUrl: z.string().optional(),
        issueUrl: z.string().optional(),
        usdReward: z.number(),
        tokenReward: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          ...input,
          claimStage: 'INIT',
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string(),
        status: z.string(),
        description: z.string().optional(),
        tags: z.string().optional(),
        figmaUrl: z.string().optional(),
        issueUrl: z.string().optional(),
        usdReward: z.number(),
        tokenReward: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.task.update({ where: { id }, data })
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.delete({ where: { id: input } })
    }),
})
