import { z } from 'zod'
import { INode } from '@penx/model-types'
import { addMarkdown, addMarkdownInput } from '../service/addMarkdown'
import {
  addNodesToToday,
  addNodesToTodayInput,
} from '../service/addNodesToToday'
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

  pullNodes: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        lastModifiedTime: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      const time = new Date(input.lastModifiedTime)
      return ctx.prisma.node.findMany({
        where: {
          spaceId: input.spaceId,
          updatedAt: {
            gt: time,
          },
        },
      })
    }),

  sync: protectedProcedure.input(syncNodesInput).mutation(({ input, ctx }) => {
    return syncNodes(input, ctx.token.uid)
  }),

  addMarkdown: publicProcedure
    .input(addMarkdownInput)
    .mutation(({ ctx, input }) => {
      return addMarkdown(input)
    }),

  addNodesToToday: publicProcedure
    .input(addNodesToTodayInput)
    .mutation(({ ctx, input }) => {
      return addNodesToToday(input)
    }),
})
