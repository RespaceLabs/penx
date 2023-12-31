import mitt from 'mitt'
import { isProd } from '@penx/constants'
import { db } from '@penx/local-db'
import { INode } from '@penx/model-types'
import { ExtensionLoader } from './ExtensionLoader'
import { penx } from './penx'
import { protectDB } from './protectDB'
import { mutateLoaderStatus } from './useLoaderStatus'

export type Events = {
  loaded: boolean
}

class AppLoader {
  emitter = mitt<Events>()

  // TODO: handle error, need retry
  async init() {
    // TODO:
    // if (isProd) {
    //   protectDB()
    // }

    try {
      const t0 = Date.now()
      ;(window as any).penx = penx as any

      await db.database.connect()
      const t1 = Date.now()

      const t2 = Date.now()
      const pluginLoader = new ExtensionLoader()
      await pluginLoader.init()

      const t3 = Date.now()

      console.log('appLoader loaded time t3-t0', t3 - t0)

      this.emitter.emit('loaded', true)

      // TODO: should not be here, should be in worker or service worker
      // const tt0 = Date.now()
      // await this.normalizeNodes()
      // const tt1 = Date.now()
      // console.log('normalize nodes time tt1-tt0', tt1 - tt0)

      mutateLoaderStatus(true)
    } catch (error) {
      console.log('loader error', error)
    }
  }

  // make all node is valid for editor render
  private normalizeNodes = async () => {
    //log
    const space = await db.getActiveSpace()
    const nodes = await db.listNodesBySpaceId(space.id)

    const nodeMap = new Map<string, INode>()
    for (const node of nodes) {
      nodeMap.set(node.id, node)
    }

    for (const node of nodes) {
      if (!node.children) continue
      for (const id of node?.children) {
        if (!id) {
          await db.updateNode(node.id, {
            children: node.children.filter((id) => !!id),
          })
          continue
        }
        const find = nodeMap.get(id)
        if (!find) {
          await db.deleteNode(id)
          await db.updateNode(node.id, {
            children: node.children.filter((id) => !!id),
          })
        }
      }
    }
  }
}

export const appLoader = new AppLoader()
