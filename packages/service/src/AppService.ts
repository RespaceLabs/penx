import { db } from '@penx/local-db'
import { store } from '@penx/store'

export class AppService {
  inited = false

  async init() {
    console.log('app init...')

    this.inited = true

    try {
      const spaces = await db.listSpaces()
      const activeSpace = spaces.find((item) => item.isActive) || spaces[0]
      const nodes = await db.listNodesBySpaceId(activeSpace.id)

      store.setSpaces(spaces)

      if (nodes.length) {
        const activeNodes = activeSpace.activeNodeIds.map((id) => {
          return nodes.find((n) => n.id === id)!
        })

        store.setNodes(nodes)
        store.setActiveNodes(activeNodes)
      }

      store.setAppLoading(false)
    } catch (error) {
      console.log('app init error.....:', error)
    }
  }
}
