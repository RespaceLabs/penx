import { z } from 'zod'
import { INode } from '@penx/model-types'
import { syncNodes, syncNodesInput } from '../service/syncNodes'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const nodeRouter = createTRPCRouter({
  listBySpaceId: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.node.findMany({
        where: { spaceId: input.spaceId },
      })
    }),

  sync: publicProcedure.input(syncNodesInput).mutation(({ ctx, input }) => {
    return syncNodes(input)
  }),
})
