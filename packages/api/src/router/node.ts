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

  getPublishedNode: publicProcedure
    .input(
      z.object({
        nodeId: z.string(),
        spaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const node = await ctx.prisma.publishedNode.findFirst({
        where: {
          nodeId: input.nodeId,
          spaceId: input.spaceId,
        },
        select: {
          id: true,
          nodeId: true,
          nodes: true,
        },
      })
      return node
    }),

  publishNode: publicProcedure
    .input(
      z.object({
        nodeId: z.string(),
        spaceId: z.string(),
        nodesData: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      async function findNode(nodeId: string) {
        return await ctx.prisma.publishedNode.findFirst({
          where: { nodeId },
          select: {
            id: true,
            nodeId: true,
            nodes: true,
          },
        })
      }
      let node = await findNode(input.nodeId)

      const nodes = JSON.parse(input.nodesData)
      if (!node) {
        await ctx.prisma.publishedNode.create({
          data: {
            nodeId: input.nodeId,
            spaceId: input.spaceId,
            nodes,
          },
        })
      } else {
        await ctx.prisma.publishedNode.update({
          where: { nodeId: input.nodeId },
          data: { nodes },
        })
      }
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
