import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { syncFromCloud } from '../../sync/src'

export class AppService {
  inited = false

  private async tryToSync(space: ISpace) {
    const time = await trpc.space.nodesLastUpdatedAt.query({
      spaceId: space.id,
    })

    if (time) {
      await db.updateSpace(space.id, {
        nodesLastUpdatedAt: time,
      })
    }

    // TODO: handle empty remote time
    if (!time) return

    const localLastUpdatedAt = await db.getLastUpdatedAt(space.id)

    if (localLastUpdatedAt && localLastUpdatedAt < time.getTime()) {
      await syncFromCloud(space)
    }
  }

  async init() {
    console.log('app init...')

    this.inited = true

    try {
      const spaces = await db.listSpaces()
      const activeSpace = spaces.find((item) => item.isActive) || spaces[0]

      if (navigator.onLine) {
        await this.tryToSync(activeSpace)
      }

      const nodes = await db.listNodesBySpaceId(activeSpace.id)
      store.space.setSpaces(spaces)

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
      console.log('app init error.....:', error)
    }
  }

  private async createAndGoToTodayNode(spaceId: string) {
    const todayNode = await db.getOrCreateTodayNode(spaceId)
    const nodes = await db.listNodesBySpaceId(spaceId)
    store.node.setNodes(nodes)
    store.node.selectNode(todayNode)
  }
}
