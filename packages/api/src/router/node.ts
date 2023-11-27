import { z } from 'zod'
import { INode } from '@penx/model-types'
import { addMarkdown, addMarkdownInput } from '../service/addMarkdown'
import { syncNodes, syncNodesInput } from '../service/syncNodes'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const nodeRouter = createTRPCRouter({
  listBySpaceId: protectedProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.node.findMany({
        where: { spaceId: input.spaceId },
      })
    }),

  sync: protectedProcedure.input(syncNodesInput).mutation(({ input }) => {
    return syncNodes(input)
  }),

  addMarkdown: publicProcedure
    .input(addMarkdownInput)
    .mutation(({ ctx, input }) => {
      return addMarkdown(input)
    }),
})
