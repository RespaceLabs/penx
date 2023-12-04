import { format } from 'date-fns'
import { node } from 'slate'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { getNewNode } from '@penx/local-db'
import { INode, ISpace, NodeType } from '@penx/model-types'

export const addNodesToTodayInput = z.object({
  spaceId: z.string(),
  nodes: z.string(),
  password: z.string().optional(),
})

export type AddNodesToTodayInput = z.infer<typeof addNodesToTodayInput>

export function addNodesToToday(input: AddNodesToTodayInput) {
  const { spaceId } = input
  const nodes = JSON.parse(input.nodes) as INode[]

  // console.log('nodes----:', nodes)

  return prisma.$transaction(
    async (tx) => {
      const space = await tx.space.findUniqueOrThrow({ where: { id: spaceId } })

      // console.log('input----------:', input)

      const dailyNodes = await tx.node.findMany({
        where: {
          spaceId,
          type: NodeType.DAILY,
        },
      })

      const todayStr = format(new Date(), 'yyyy-MM-dd')

      let todayNode = dailyNodes.find(
        (node) => (node.props as any).date === todayStr,
      )

      if (!todayNode) {
        // TODO: create today node
      }

      await tx.node.createMany({
        data: nodes.map((item) => {
          const { openedAt, createdAt, updatedAt, ...rest } = item
          return {
            ...rest,
            parentId: item.parentId || todayNode?.id,
            openedAt: new Date(openedAt),
          }
        }),
      })

      // console.log('=====todayNode:', todayNode)

      // console.log('=========nodes:', nodes)

      const newIds = nodes.filter((n) => !n.parentId).map((n) => n.id)

      await tx.node.update({
        where: { id: todayNode!.id },
        data: {
          children: [...(todayNode!.children as any), ...newIds],
        },
      })

      await tx.space.update({
        where: { id: input.spaceId },
        data: {
          nodeSnapshot: {
            version: (space.nodeSnapshot as any).version + 1,
            nodeMap: {},
          },
        },
      })

      // console.log('add not successful.............')
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
