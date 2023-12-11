import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const sharedDocRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       title: z.string(),
  //       content: z.string(),
  //     }),
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.sharedDoc.create({ data: input })
  //   }),
  // byId: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ ctx, input }) => {
  //     return ctx.prisma.sharedDoc.findFirst({ where: { id: input.id } })
  //   }),
})
