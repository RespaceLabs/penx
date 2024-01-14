import Redis from 'ioredis'
import { z } from 'zod'
import { Node, prisma } from '@penx/db'
import { INode, NodeType } from '@penx/model-types'

const redis = new Redis(process.env.REDIS_URL!)

export const syncNodesInput = z.object({
  spaceId: z.string(),
  nodes: z.string(),
})

export type SyncUserInput = z.infer<typeof syncNodesInput>

export function syncNodes(input: SyncUserInput, userId: string) {
  const newNodes: INode[] = JSON.parse(input.nodes)
  const { spaceId } = input

  if (!newNodes?.length) return null

  return prisma.$transaction(
    async (tx) => {
      let nodes = await tx.node.findMany({ where: { spaceId } })

      const nodeIdsSet = new Set(nodes.map((node) => node.id))

      const updatedNodes: INode[] = []
      const addedNodes: INode[] = []

      for (const n of newNodes) {
        if (nodeIdsSet.has(n.id)) {
          updatedNodes.push(n)
        } else {
          addedNodes.push(n)
        }
      }

      // console.log(
      //   '=======updatedNodes:',
      //   JSON.stringify(updatedNodes, null, 2),
      //   'addedNodes:',
      //   JSON.stringify(addedNodes, null, 2),
      // )

      await tx.node.createMany({ data: addedNodes })

      const promises = updatedNodes.map((n) => {
        // console.log('========n:', n)
        return tx.node.update({ where: { id: n.id }, data: n })
      })

      await Promise.all(promises)

      // TODO: should clean no used nodes
      nodes = await tx.node.findMany({
        where: { spaceId },
      })

      const node = await tx.node.findFirst({
        where: { spaceId },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 1,
      })

      const key = 'NODES_SYNCED'
      const data = {
        spaceId,
        userId,
        lastModifiedTime: node!.updatedAt.getTime(),
      }

      // console.log('==========data:', data)

      redis.publish(key, JSON.stringify(data))

      await cleanDeletedNodes(nodes, async (id) => {
        tx.node.delete({
          where: { id },
        })
      })

      const lastNode = await tx.node.findFirst({
        where: { spaceId: input.spaceId },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      })

      return lastNode?.updatedAt ?? null
    },
    {
      maxWait: 1000 * 60, // default: 2000
      timeout: 1000 * 60, // default: 5000
    },
  )
}

async function cleanDeletedNodes(
  nodes: Node[],
  deleteNode: (id: string) => Promise<void>,
) {
  const nodeMap = new Map<string, Node>()

  for (const node of nodes) {
    nodeMap.set(node.id, node)
  }

  for (const node of nodes) {
    // TODO: need improvement
    if (
      [
        NodeType.DATABASE,
        // NodeType.COLUMN,
        // NodeType.ROW,
        // NodeType.VIEW,
        // NodeType.CELL,
        NodeType.ROOT,
        NodeType.DAILY_ROOT,
        NodeType.DATABASE_ROOT,
      ].includes(node.type as NodeType)
    ) {
      continue
    }

    // if (!Reflect.has(node, 'parentId')) continue
    if (!node.parentId) continue

    const parentNode = nodeMap.get(node.parentId)
    const children = (parentNode?.children || []) as string

    if (!children.includes(node.id)) {
      console.log('=======clear node!!!!', node, JSON.stringify(node.element))
      await deleteNode(node.id)
    }
  }
}
