import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace, NodeType } from '@penx/model-types'
import { trpc } from '@penx/trpc-client'
import { getNodeMap } from './getNodeMap'

export async function syncToCloud(): Promise<boolean> {
  const space = await db.getActiveSpace()
  if (!space || !space.isCloud) return false

  // push all nodes
  if (space.nodeSnapshot.version === 0) {
    const remoteVersion = await trpc.space.version.query({ spaceId: space.id })

    console.log('sync all to cloud..........')

    if (space.nodeSnapshot.version < remoteVersion) return false
    remoteVersion === 0
    await pushAllNodes(space)
    return true
  } else {
    return await pushByDiff(space)
  }
}

async function pushAllNodes(space: ISpace) {
  const nodes = await db.listNodesBySpaceId(space.id)

  const newVersion = await submitToServer(space, {
    added: nodes,
  })

  console.log('push all node to cloud done!!!!')

  await db.updateSpace(space.id, {
    nodeSnapshot: {
      version: newVersion,
      nodeMap: getNodeMap(nodes),
    },
  })
}

async function pushByDiff(space: ISpace): Promise<boolean> {
  const nodes = await db.listNodesBySpaceId(space.id)

  const prevNodeMap = space.nodeSnapshot.nodeMap

  const curNodeMap = getNodeMap(nodes)

  const diffed = diffNodeMap(prevNodeMap, curNodeMap)

  const nodeMap = new Map<string, INode>()

  for (const node of nodes) {
    nodeMap.set(node.id, node)
  }

  if (diffed.isEqual) {
    console.log('is equal, no need to push', diffed)
  } else {
    console.log('cloud diff:', diffed)
  }

  if (!diffed.isEqual) {
    if (diffed.deleted) {
      const some = diffed.deleted.some((id) => {
        const node = nodeMap.get(id)
        return [
          NodeType.ROOT,
          NodeType.INBOX,
          NodeType.TRASH,
          NodeType.DAILY_ROOT,
          NodeType.DAILY,
          NodeType.FAVORITE,
        ].includes(node?.type!)
      })

      if (some) {
        throw new Error('some bug happened,can not delete this nodes')
      }
    }

    const data = {
      added: diffed.added.map((id) => nodeMap.get(id)!),
      updated: diffed.updated.map((id) => nodeMap.get(id)!),
      deleted: diffed.deleted,
    }

    console.log('======diffed data:', data)

    const newVersion = await submitToServer(space, data)

    await db.updateSpace(space.id, {
      nodeSnapshot: {
        version: newVersion,
        nodeMap: getNodeMap(nodes),
      },
    })

    return true
  }
  return false
}

export interface Options {
  added: INode[]
  updated: INode[]
  deleted: string[]
}

async function submitToServer(space: ISpace, diffed: Partial<Options>) {
  const { password } = space
  const { added = [], updated = [], deleted = [] } = diffed
  const encrypted = space.encrypted && password

  const newVersion = await trpc.node.sync.mutate({
    version: space.nodeSnapshot.version,
    spaceId: space.id,
    added: JSON.stringify(
      encrypted
        ? added.map((node) => new Node(node).toEncrypted(password))
        : added,
    ),
    updated: JSON.stringify(
      encrypted
        ? updated.map((node) => new Node(node).toEncrypted(password))
        : updated,
    ),
    deleted: JSON.stringify(deleted),
  })

  return newVersion
}

type NodeMap = Record<string, string>

function diffNodeMap(serverMap: NodeMap, localMap: NodeMap) {
  const localIds = Object.keys(localMap)
  const serverIds = Object.keys(serverMap)

  let added = localIds.filter((item) => !serverIds.includes(item))
  let deleted = serverIds.filter((item) => !localIds.includes(item))

  const same = localIds.filter((item) => serverIds.includes(item))

  const updated: string[] = []

  for (const id of same) {
    if (localMap[id] !== serverMap[id]) {
      updated.push(id)
    }
  }

  const isEqual =
    added.length === 0 && updated.length === 0 && deleted.length === 0

  const diffed = {
    isEqual,
    added,
    deleted,
    updated,
  }
  return diffed
}
