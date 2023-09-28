import { db } from '@penx/local-db'
import * as storageEstimate from '@penx/storage-estimate'
import * as wordCount from '@penx/word-count'

const builtins = [
  { id: 'storage-estimate', activate: storageEstimate.activate },
  { id: 'word-count', activate: wordCount.activate },
]

export class PluginLoader {
  async init() {
    this.initBuiltinPlugins()
    await this.initThirdPartyPlugins()
  }

  initBuiltinPlugins() {
    for (const plugin of builtins) {
      const ctx = Object.create(window.penx, {
        pluginId: {
          writable: false,
          configurable: false,
          value: plugin.id,
        },
      })
      plugin.activate(ctx)
    }
  }

  async initThirdPartyPlugins() {
    const plugins = await db.listPlugins()
    for (const item of plugins) {
      // eval(`
      // ${item.code}
      //   activate(Object.create(penx, {
      //     pluginId: {
      //         writable: false,
      //         configurable: false,
      //         value: "${item.manifest.id}"
      //       }
      //   }))
      // `)
      const script = document.createElement('script')
      script.type = 'module'

      script.innerHTML = `
        ${item.code}
        
        const ctx = Object.create(window.penx, {
          pluginId: {
              writable: false,
              configurable: false,
              value: "${item.manifest.id}"
            }
        })

        activate(ctx)
      `
      document.body.appendChild(script)
    }
  }
}
