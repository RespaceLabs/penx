import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const nodeRouter = createTRPCRouter({
  listBySpaceId: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.node.findMany({
        where: { spaceId: input.spaceId },
      })
    }),
})
