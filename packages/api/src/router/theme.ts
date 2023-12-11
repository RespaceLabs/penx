import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const themeRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.theme.findMany({ orderBy: { id: 'desc' } })
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.theme.findFirst({ where: { id: input.id } })
    }),

  bySpaceId: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.theme.findFirst({ where: { spaceId: input.spaceId } })
    }),

  // create: publicProcedure
  //   .input(
  //     z.object({
  //       spaceId: z.string().min(1),
  //       name: z.string().min(1),
  //     }),
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.theme.create({
  //       data: {
  //         ...input,
  //         userId: ctx.token.uid,
  //       },
  //     })
  //   }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        introduction: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.theme.update({ where: { id }, data })
    }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.theme.delete({ where: { id: input } })
  }),
})
