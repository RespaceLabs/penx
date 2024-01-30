import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const taskRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      // TODO: debug
      // orderBy: { createdAt: 'desc' },
    })
  }),

  myTask: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: { userId: ctx.token.uid },
      // orderBy: { createdAt: 'desc' },
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        status: z.string().min(1),
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
