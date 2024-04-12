import { db } from '@penx/local-db'
import { INode, ISpace } from '@penx/model-types'
import { getActiveSpaceId, getAuthorizedUser } from '@penx/storage'
import { SyncServerClient } from '@penx/sync-server-client'

export async function syncToCloud(mnemonic: string): Promise<boolean> {
  // console.log('syncToCloud......')

  const activeSpaceId = await getActiveSpaceId()
  const spaces = await db.listSpaces()
  const space = spaces.find((s) => s.id === activeSpaceId)
  if (!space) return false

  const nodesLastUpdatedAt = space.nodesLastUpdatedAt

  // console.log('=========nodesLastUpdatedAt:', nodesLastUpdatedAt)

  // push all nodes
  if (!nodesLastUpdatedAt) {
    console.log('sync all to cloud..........')
    await pushAllNodes(space, mnemonic)
    return true
  } else {
    console.log('sync diff to cloud..........')
    try {
      return await pushByDiff(space, nodesLastUpdatedAt, mnemonic)
    } catch (error: any) {
      console.log('sync error===============:', error)

      if (error.message === 'NODES_BROKEN') {
        await pushAllNodes(space, mnemonic)
        return true
      }
      return false
    }
  }
}

async function pushAllNodes(space: ISpace, mnemonic: string) {
  const nodes = await db.listNodesBySpaceId(space.id)
  await submitToServer(space, nodes, mnemonic)
}

async function pushByDiff(
  space: ISpace,
  nodesLastUpdatedAt: Date,
  mnemonic: string,
): Promise<boolean> {
  const nodes = await db.listNodesBySpaceId(space.id)

  const newNodes = nodes.filter((n) => {
    return new Date(n.updatedAt).getTime() > nodesLastUpdatedAt.getTime()
  })

  if (!newNodes.length) return true

  await submitToServer(space, newNodes, mnemonic)

  return true
}

export interface Options {
  added: INode[]
  updated: INode[]
  deleted: string[]
}

export async function submitToServer(
  space: ISpace,
  nodes: INode[],
  mnemonic: string,
) {
  const user = await getAuthorizedUser()
  if (!user.syncServerUrl || !mnemonic) return
  const client = new SyncServerClient(
    space,
    mnemonic,
    user.syncServerUrl,
    user.syncServerAccessToken,
  )
  const { time } = await client.pushNodes(nodes)

  // console.log('time========:', time)

  if (time) {
    await db.updateSpace(space.id, {
      nodesLastUpdatedAt: new Date(time),
    })
  }
}
