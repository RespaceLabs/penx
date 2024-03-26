import { db } from '@penx/local-db'
import { decryptByMnemonic } from '@penx/mnemonic'
import { INode, ISpace } from '@penx/model-types'
import { SyncServerClient } from '@penx/sync-server-client'

/**
 * fallback for old data
 * @param space
 * @param mnemonic
 * @returns
 */
async function fallbackForMnemonic(
  space: ISpace,
  mnemonic: string,
): Promise<boolean> {
  const rootNode = await db.getRootNode(space.id)
  const client = new SyncServerClient(space, mnemonic)

  const remoteRootNode = await client.getNode(rootNode.id)

  if (!remoteRootNode) {
    await pushAllNodes(space, mnemonic)
    return true
  }

  try {
    const originElement = decryptByMnemonic(remoteRootNode.element, mnemonic)
    // console.log('====originElement:', originElement)

    return false
  } catch (error) {
    console.log('======decryptByMnemonic fail:', error)
    // decryptByMnemonic fail, so push all nodes
    await pushAllNodes(space, mnemonic)
    return true
  }
}

export async function syncToCloud(mnemonic: string): Promise<boolean> {
  console.log('syncToCloud......')

  const space = await db.getActiveSpace()
  if (!space) return false

  const nodesLastUpdatedAt = space.nodesLastUpdatedAt

  console.log('=========nodesLastUpdatedAt:', nodesLastUpdatedAt)

  // console.log('-------lastModifiedTime:', lastModifiedTime)

  // TODO: fallback for old data, remove it in the future
  const isSynced = await fallbackForMnemonic(space, mnemonic)
  if (isSynced) return true

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
  if (!space.syncServerUrl || !mnemonic) return
  const client = new SyncServerClient(space, mnemonic)
  const { time } = await client.pushNodes(nodes)

  // console.log('time========:', time)

  if (time) {
    await db.updateSpace(space.id, {
      nodesLastUpdatedAt: new Date(time),
    })
  }
}
