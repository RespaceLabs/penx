import mitt from 'mitt'
import { isProd } from '@penx/constants'
import { db } from '@penx/local-db'
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
    if (isProd) {
      protectDB()
    }

    try {
      const t0 = Date.now()
      window.penx = penx as any

      await db.database.connect()
      const t1 = Date.now()
      await db.init()

      const t2 = Date.now()
      const pluginLoader = new ExtensionLoader()
      await pluginLoader.init()

      const t3 = Date.now()

      console.log('appLoader loaded time t3-t0', t3 - t0)

      this.emitter.emit('loaded', true)

      mutateLoaderStatus(true)
    } catch (error) {
      console.log('loader error', error)
    }
  }
}

export const appLoader = new AppLoader()
