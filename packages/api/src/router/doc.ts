import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const docRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.doc.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.doc.findFirst({ where: { id: input.id } })
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.doc.findFirst({ where: { slug: input.slug } })
    }),

  listBySpaceId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.doc.findMany({ where: { spaceId: input.id } })
    }),

  recentDocs: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.doc.findMany({
        where: { spaceId: input.spaceId },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      })
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        spaceId: z.string(),
        title: z.string(),
        content: z.string(),
        slug: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.doc.create({ data: input })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        spaceId: z.string().optional(),
        title: z.string().optional(),
        content: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.doc.update({ where: { id }, data })
    }),

  updateContentBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        spaceId: z.string(),
        title: z.string().optional(),
        content: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { slug, spaceId, ...data } = input
      return ctx.prisma.doc.updateMany({
        where: { slug, spaceId },
        data: { ...data, synced: false },
      })
    }),

  updateBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string().optional(),
        content: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { slug, ...data } = input
      return ctx.prisma.doc.updateMany({ where: { slug }, data })
    }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.doc.delete({ where: { id: input } })
  }),

  deleteBySlug: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.doc.deleteMany({ where: { slug: input } })
  }),
})
