import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const extensionRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.extension.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  publishExtension: publicProcedure
    .input(
      z.object({
        uniqueId: z.string(),
        name: z.string(),
        version: z.string(),
        code: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log('input.............:', input)
      return ctx.prisma.extension.create({ data: input })
    }),
})
