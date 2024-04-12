import { format } from 'date-fns'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { getNewNode } from '@penx/local-db'
import { INode, ISpace, NodeType } from '@penx/model-types'

export const addMarkdownInput = z.object({
  spaceId: z.string(),
  markdown: z.string(),
  password: z.string().optional(),
})

export type AddMarkdownInput = z.infer<typeof addMarkdownInput>

export function addMarkdown(input: AddMarkdownInput) {
  const { spaceId, markdown } = input

  return prisma.$transaction(
    async (tx) => {
      const space = await tx.space.findUniqueOrThrow({ where: { id: spaceId } })

      console.log('input----------:', input)
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

      const newNode = await tx.node.create({
        data: getNewNode(
          {
            spaceId,
            parentId: todayNode!.id,
          },
          markdown.split('\n')[0],
        ),
      })

      await tx.node.update({
        where: { id: todayNode!.id },
        data: {
          children: [...(todayNode!.children as any), newNode.id],
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

      console.log('add not successful.............')
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
