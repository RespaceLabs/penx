import { extensionList } from '@penx/extension-list'
import { db } from '@penx/local-db'
import { penx } from './penx'

export class ExtensionLoader {
  async init() {
    this.initBuiltinExtensions()
    // await this.initThirdPartyExtensions()
  }

  initBuiltinExtensions() {
    for (const item of extensionList) {
      const ctx = Object.create(penx, {
        pluginId: {
          writable: false,
          configurable: false,
          value: item.id,
        },
      })
      item.activate(ctx)
    }
  }

  // async initThirdPartyExtensions() {
  //   const extensions = await db.listExtensions()

  //   for (const item of extensions) {
  //     // eval(`
  //     // ${item.code}
  //     //   activate(Object.create(penx, {
  //     //     pluginId: {
  //     //         writable: false,
  //     //         configurable: false,
  //     //         value: "${item.manifest.id}"
  //     //       }
  //     //   }))
  //     // `)
  //     const script = document.createElement('script')
  //     script.type = 'module'

  //     script.innerHTML = `
  //       ${item.code}

  //       const ctx = Object.create(window.penx, {
  //         pluginId: {
  //             writable: false,
  //             configurable: false,
  //             value: "${item.slug}"
  //           }
  //       })

  //       activate(ctx)
  //     `
  //     document.body.appendChild(script)
  //   }
  // }
}
