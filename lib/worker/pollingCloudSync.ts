import { WorkerEvents } from '../constants'
import { db } from '../local-db'
import { getLocalSession } from '../local-session'
import { api } from '../trpc'
import { sleep } from '../utils'

const timeMap: Record<string, number> = {
  '10m': 10 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
}

const GOOGLE_DRIVE_BACKUP_INTERVAL = timeMap['10']

export async function pollingCloudSync() {
  let pollingInterval = 10 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    try {
      const session = await getLocalSession()
      if (session?.userId) {
        await sync()
      }
    } catch (error) {
      console.log('error=========:', error)
    }

    await sleep(pollingInterval)
  }
}

async function sync() {
  console.log('Could sync....')
  const localLastUpdatedAt = await db.getLastUpdatedAt()
  const remoteLastUpdatedAt = await api.node.lastUpdatedAt.query()
  console.log(
    '=====remoteLastUpdatedAt:',
    remoteLastUpdatedAt,
    localLastUpdatedAt,
  )

  if (localLastUpdatedAt === 0) return

  if (localLastUpdatedAt === remoteLastUpdatedAt) {
    console.log('No need to sync')
    return
  }

  if (localLastUpdatedAt > remoteLastUpdatedAt) {
    // push to server
    console.log('=====push to server....')
    await pushToServer(remoteLastUpdatedAt)
  } else {
    console.log('>>>>>pull to local....')
    // pull to server
    await pullFromServer(localLastUpdatedAt)
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

async function pullFromServer(localLastUpdatedAt: number) {
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
  postMessage(WorkerEvents.PULL_SUCCEEDED)
}
