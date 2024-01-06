import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { trpc } from '@penx/trpc-client'

export async function syncToCloud(): Promise<boolean> {
  const space = await db.getActiveSpace()
  if (!space) return false

  const nodesLastUpdatedAt = space.nodesLastUpdatedAt

  // console.log('-------lastModifiedTime:', lastModifiedTime)

  // push all nodes
  if (!nodesLastUpdatedAt) {
    // console.log('sync all to cloud..........')
    await pushAllNodes(space)
    return true
  } else {
    // console.log('sync diff to cloud..........')
    return await pushByDiff(space, nodesLastUpdatedAt)
  }
}

async function pushAllNodes(space: ISpace) {
  const nodes = await db.listNodesBySpaceId(space.id)
  await submitToServer(space, nodes)
}

async function pushByDiff(
  space: ISpace,
  nodesLastUpdatedAt: Date,
): Promise<boolean> {
  const nodes = await db.listNodesBySpaceId(space.id)

  const newNodes = nodes.filter(
    (n) => n.updatedAt.getTime() > nodesLastUpdatedAt.getTime(),
  )

  // console.log('=====newNodes:', newNodes)

  if (!newNodes.length) return true

  await submitToServer(space, newNodes)

  return true
}

export interface Options {
  added: INode[]
  updated: INode[]
  deleted: string[]
}

export async function submitToServer(space: ISpace, nodes: INode[]) {
  const { password } = space
  const encrypted = space.encrypted && password

  const time = await trpc.node.sync.mutate({
    spaceId: space.id,
    nodes: JSON.stringify(
      encrypted
        ? nodes.map((node) => new Node(node).toEncrypted(password))
        : nodes,
    ),
  })

  if (time) {
    await db.updateSpace(space.id, {
      nodesLastUpdatedAt: time,
    })
  }
}
