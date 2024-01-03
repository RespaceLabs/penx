import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { trpc } from '@penx/trpc-client'

export async function syncToCloud(): Promise<boolean> {
  const space = await db.getActiveSpace()
  if (!space) return false

  const lastModifiedTime = await trpc.space.lastModifiedTime.query({
    spaceId: space.id,
  })

  // console.log('-------lastModifiedTime:', lastModifiedTime)

  // push all nodes
  if (!lastModifiedTime) {
    // console.log('sync all to cloud..........')
    await pushAllNodes(space)
    return true
  } else {
    // console.log('sync diff to cloud..........')
    return await pushByDiff(space, lastModifiedTime)
  }
}

async function pushAllNodes(space: ISpace) {
  const nodes = await db.listNodesBySpaceId(space.id)
  await submitToServer(space, nodes)
}

async function pushByDiff(
  space: ISpace,
  lastModifiedTime: Date,
): Promise<boolean> {
  const nodes = await db.listNodesBySpaceId(space.id)

  const newNodes = nodes.filter(
    (n) => n.updatedAt.getTime() > lastModifiedTime.getTime(),
  )

  console.log('=====newNodes:', newNodes)
  await submitToServer(space, newNodes)
  return true
}

export interface Options {
  added: INode[]
  updated: INode[]
  deleted: string[]
}

async function submitToServer(space: ISpace, nodes: INode[]) {
  const { password } = space
  const encrypted = space.encrypted && password

  if (!nodes.length) return

  await trpc.node.sync.mutate({
    spaceId: space.id,
    nodes: JSON.stringify(
      encrypted
        ? nodes.map((node) => new Node(node).toEncrypted(password))
        : nodes,
    ),
  })
}

type NodeMap = Record<string, string>
