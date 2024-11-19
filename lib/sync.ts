import { WorkerEvents } from './constants'
import { db } from './local-db'
import { api } from './trpc'

export async function sync(isWorker = false) {
  const localLastUpdatedAt = await db.getLastUpdatedAt()
  const remoteLastUpdatedAt = await api.node.lastUpdatedAt.query()
  // console.log(
  //   '=====remoteLastUpdatedAt:',
  //   remoteLastUpdatedAt,
  //   localLastUpdatedAt,
  // )

  if (localLastUpdatedAt === 0) return

  if (localLastUpdatedAt === remoteLastUpdatedAt) {
    console.log('No need to sync')
    return
  }

  if (localLastUpdatedAt > remoteLastUpdatedAt) {
    // push to server
    // console.log('=====push to server....')
    await pushToServer(remoteLastUpdatedAt)
  } else {
    // console.log('>>>>>pull to local....')
    // pull to server
    await pullFromServer(localLastUpdatedAt, isWorker)
  }
}

async function pushToServer(remoteLastUpdatedAt: number) {
  const nodes = await db.listNodesByUserId()
  const newNodes = nodes.filter((n) => {
    return new Date(n.updatedAt).getTime() > remoteLastUpdatedAt
  })

  console.log('======newNodes:', newNodes)

  await api.node.sync.mutate({
    nodes: JSON.stringify(nodes),
  })
}

async function pullFromServer(localLastUpdatedAt: number, isWorker = false) {
  const newRemoteNodes = await api.node.pulledNodes.query({
    localLastUpdatedAt,
  })

  console.log('nodes====:', newRemoteNodes)

  const localNodes = await db.listNodesByUserId()
  for (const item of newRemoteNodes) {
    const existedNode = localNodes.find((n) => n.id === item.id)

    if (existedNode) {
      await db.updateNode(item.id, item as any)
    } else {
      await db.createNode(item as any)
    }
  }
  if (isWorker) {
    postMessage(WorkerEvents.PULL_SUCCEEDED)
  }
}
