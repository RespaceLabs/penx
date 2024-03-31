import { error } from 'console'
import { LOCAL_USER_ID } from '@penx/constants'
import { db } from '@penx/local-db'
import { Node, Space } from '@penx/model'
import { ISpace } from '@penx/model-types'
import {
  getActiveSpaceId,
  getLocalSession,
  setActiveSpaceId,
} from '@penx/storage'
import { store } from '@penx/store'
import { syncFromCloud } from '@penx/sync'
import { SyncServerClient } from '@penx/sync-server-client'

export class AppService {
  inited = false

  private async tryToGetActiveSpace(): Promise<{
    activeSpace: ISpace
    spaces: ISpace[]
  }> {
    const session = await getLocalSession()
    let spaces = await db.listSpaces(session?.userId, session)
    let activeSpace: ISpace

    if (session) {
      const activeSpaceId = await getActiveSpaceId()

      const space = spaces.find((space) => space.id === activeSpaceId)
      if (space) {
        activeSpace = space
      } else {
        activeSpace = spaces[0]
        await setActiveSpaceId(activeSpace.id)
      }
    } else {
      activeSpace = spaces.find((item) => item.userId === LOCAL_USER_ID)!

      if (!activeSpace) {
        activeSpace = await db.createLocalSpace()
        spaces = await db.listSpaces(undefined, session)
      }
    }

    return { activeSpace, spaces }
  }

  async init() {
    try {
      console.log('app init....')

      this.inited = true

      const { activeSpace, spaces } = await this.tryToGetActiveSpace()

      await Promise.all([
        db.normalizeDailyNodes(activeSpace.id),

        // console.log('tryToSync................')
        this.tryToSync(activeSpace),
      ])

      let nodes = await db.listNodesBySpaceId(activeSpace.id)

      store.space.setActiveSpace(activeSpace)
      store.space.setSpaces(spaces)

      // console.log('appService=======nodes:', nodes)

      if (!nodes.length) {
        // console.log('========activeSpace:', activeSpace)

        const mnemonic = store.user.getMnemonic()

        const client = new SyncServerClient(activeSpace, mnemonic)
        nodes = await client.getAllNodes()

        // console.log('all nodes======:', nodes)

        for (const node of nodes) {
          await db.createNode(node)
        }
      }

      // get nodesLastUpdatedAt and try to pull from cloud

      if (nodes.length) {
        const todayNode = await db.getNodeByDate(activeSpace.id)

        if (!todayNode) {
          await this.createAndGoToTodayNode(activeSpace.id)
          store.app.setAppLoading(false)
          return
        }

        let activeNodes = activeSpace.activeNodeIds
          .map((id) => {
            return nodes.find((n) => n.id === id)!
          })
          .filter((n) => !!n)

        store.node.setNodes(nodes)

        if (!activeNodes.length) {
          const rootNode = nodes.find((n) => new Node(n).isRootNode)!

          store.node.selectNode(rootNode)
        } else {
          store.node.setActiveNodes(activeNodes)
        }
      }

      store.app.setAppLoading(false)
    } catch (error) {
      console.log('===========app init error:', error)
      // TODO: fallback to old data
      store.app.setAppLoading(false)
    }
  }

  private async createAndGoToTodayNode(spaceId: string) {
    const todayNode = await db.getOrCreateTodayNode(spaceId)
    const nodes = await db.listNodesBySpaceId(spaceId)
    store.node.setNodes(nodes)
    store.node.selectNode(todayNode)
  }

  private async tryToSync(space: ISpace) {
    if (!navigator.onLine) return
    if (!space.syncServerUrl) return
    const mnemonic = store.user.getMnemonic()
    const client = new SyncServerClient(space, mnemonic)
    const time = await client.getNodesLastUpdatedAt()

    if (time) {
      await db.updateSpace(space.id, {
        nodesLastUpdatedAt: new Date(time),
      })
    }

    // TODO: handle empty remote time
    if (!time) return

    const localLastUpdatedAt = await db.getLastUpdatedAt(space.id)

    console.log('==========localLastUpdatedAt:', localLastUpdatedAt)

    if (typeof localLastUpdatedAt === 'number' && localLastUpdatedAt < time) {
      const mnemonic = store.user.getMnemonic()
      await syncFromCloud(space, mnemonic)
    }
  }
}
