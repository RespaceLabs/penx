import { getPassword } from '@penx/encryption'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'
import { trpc } from '@penx/trpc-client'

export async function syncToCloud(): Promise<boolean> {
  const space = await db.getActiveSpace()
  if (!space || !space.isCloud) return false

  // push all nodes
  if (space.nodeSnapshot.version === 0) {
    const remoteVersion = await trpc.space.version.query({ spaceId: space.id })

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

  await db.updateSpace(space.id, {
    nodeSnapshot: { version: newVersion, nodeMap: getNodeMap(nodes) },
  })
}

async function pushByDiff(space: ISpace): Promise<boolean> {
  const prevNodeMap = space.nodeSnapshot.nodeMap
  const nodes = await db.listNodesBySpaceId(space.id)
  const curNodeMap = getNodeMap(nodes)
  const diffed = diffNodeMap(prevNodeMap, curNodeMap)

  const nodeMap = new Map<string, INode>()
  for (const node of nodes) {
    nodeMap.set(node.id, node)
  }

  if (diffed.isEqual) {
    // console.log('is equal, no need to push')
  }

  if (!diffed.isEqual) {
    const newVersion = await submitToServer(space, {
      added: diffed.added.map((id) => nodeMap.get(id)!),
      updated: diffed.updated.map((id) => nodeMap.get(id)!),
      deleted: diffed.deleted,
    })

    await db.updateSpace(space.id, {
      nodeSnapshot: { version: newVersion, nodeMap: getNodeMap(nodes) },
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
  const password = await getPassword()

  console.log('==========password:', password)

  const { added = [], updated = [], deleted = [] } = diffed
  const newVersion = await trpc.node.sync.mutate({
    version: space.nodeSnapshot.version,
    spaceId: space.id,
    added: JSON.stringify(added),
    updated: JSON.stringify(updated),
    deleted: JSON.stringify(deleted),
  })

  return newVersion
}

function getNodeMap(nodes: INode[]) {
  return nodes.reduce(
    (acc, cur) => {
      const node = new Node(cur)
      return { ...acc, [node.id]: node.hash }
    },
    {} as Record<string, string>,
  )
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

  return {
    isEqual,
    added,
    deleted,
    updated,
  }
}
