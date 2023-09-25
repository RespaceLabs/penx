import mitt from 'mitt'
import { db } from '@penx/local-db'
import { penx } from './penx'
import { PluginLoader } from './PluginLoader'

export type Events = {
  loaded: boolean
}

class AppLoader {
  emitter = mitt<Events>()

  // TODO: handle error, need retry
  async init() {
    try {
      const t0 = Date.now()
      window.penx = penx as any

      await db.database.connect()
      const t1 = Date.now()
      await db.init()

      const t2 = Date.now()
      const pluginLoader = new PluginLoader()
      await pluginLoader.init()

      const t3 = Date.now()

      console.log('appLoader time t3-t0', t3 - t0)

      this.emitter.emit('loaded', true)
    } catch (error) {
      console.log('loader error', error)
    }
  }
}

export const appLoader = new AppLoader()
