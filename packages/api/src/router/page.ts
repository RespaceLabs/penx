import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const pageRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.page.findMany({ orderBy: { id: 'desc' } })
  }),

  listBySpaceId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.page.findMany({
        where: { spaceId: input.id },
        orderBy: { createdAt: 'asc' },
      })
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.page.findFirst({ where: { id: input.id } })
    }),

  create: publicProcedure
    .input(
      z.object({
        spaceId: z.string().min(1),
        title: z.string().min(1),
        pathname: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.page.create({ data: input })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        pathname: z.string().min(1).optional(),
        redirect: z.string().optional(),
        content: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.page.update({ where: { id }, data })
    }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.page.delete({ where: { id: input } })
  }),
})
