import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { SyncServerClient } from '@penx/sync-server-client'
import { syncFromCloud } from '../../sync/src'

export class AppService {
  inited = false

  async init() {
    try {
      console.log('app init...')

      this.inited = true

      const spaces = await db.listSpaces()

      const activeSpace = spaces.find((item) => item.isActive) || spaces[0]

      await db.normalizeDailyNodes(activeSpace.id)

      if (navigator.onLine) {
        try {
          console.log('tryToSync................')

          await this.tryToSync(activeSpace)
        } catch (error) {
          console.log('========try to sync error', error)
        }
      }

      let nodes = await db.listNodesBySpaceId(activeSpace.id)
      store.space.setSpaces(spaces)

      // console.log('appService=======nodes:', nodes)

      if (!nodes.length) {
        console.log('========activeSpace:', activeSpace)

        const mnemonic = store.user.getMnemonic()
        console.log('========mnemonic:', mnemonic)

        const client = new SyncServerClient(activeSpace, mnemonic)
        nodes = await client.getAllNodes()

        // console.log('all nodes======:', nodes)

        for (const node of nodes) {
          await db.createNode(node)
        }
      }

      // get nodesLastUpdatedAt and try to pull from cloud

      if (nodes.length) {
        const todayNode = await db.getTodayNode(activeSpace.id)

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
