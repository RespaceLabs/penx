import ky from 'ky'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { SyncServerClient } from '@penx/sync-server-client'
import { api } from '@penx/trpc-client'

export async function syncToCloud(): Promise<boolean> {
  const space = await db.getActiveSpace()
  if (!space) return false

  const nodesLastUpdatedAt = space.nodesLastUpdatedAt

  console.log('=========nodesLastUpdatedAt:', nodesLastUpdatedAt)

  // console.log('-------lastModifiedTime:', lastModifiedTime)

  // push all nodes
  if (!nodesLastUpdatedAt) {
    console.log('sync all to cloud..........')
    await pushAllNodes(space)
    return true
  } else {
    console.log('sync diff to cloud..........')
    try {
      return await pushByDiff(space, nodesLastUpdatedAt)
    } catch (error: any) {
      if (error.message === 'NODES_BROKEN') {
        await pushAllNodes(space)
        return true
      }
      return false
    }
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

  console.log('=====newNodes:', newNodes)

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
  if (!space.syncServerUrl) return
  const client = new SyncServerClient(space)
  const { time } = await client.pushNodes(nodes)

  console.log('time========:', time)

  if (time) {
    await db.updateSpace(space.id, {
      nodesLastUpdatedAt: new Date(time),
    })
  }
}
