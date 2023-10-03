import type { AutoformatRule } from '@udecode/plate-autoformat'
import { Editor } from 'slate'
import { BlockElement, OnKeyDown } from '@penx/plugin-typings'
import { PluginStore as PluginStoreJSON } from '@penx/store'

export class PluginStore {
  rules: AutoformatRule[] = []

  withFns: ((editor: Editor) => Editor)[] = []

  constructor(private store: PluginStoreJSON) {
    this.init()
  }

  private init() {
    // builtin plugins
    const { store, withFns, rules } = this

    let inlineTypes: string[] = []
    let voidTypes: string[] = []
    let elementMaps: Record<string, BlockElement> = {}
    let onKeyDownFns: OnKeyDown[] = []

    // penx plugins
    for (const name of Object.keys(store)) {
      const plugin = store[name]
      if (!plugin.block) continue
      const { elements = [] } = plugin.block
      if (plugin.block?.with) withFns.push(plugin.block.with)

      if (plugin.block.handlers?.onKeyDown) {
        onKeyDownFns.push(plugin.block.handlers.onKeyDown)
      }

      if (plugin.block.autoformatRules) {
        this.rules = [...this.rules, ...plugin.block.autoformatRules]
      }

      for (const ele of elements) {
        // get inline types
        if (isBooleanTrue(ele.isInline)) inlineTypes.push(ele.type)

        // get void types
        if (isBooleanTrue(ele.isVoid)) voidTypes.push(ele.type)

        // set element maps
        elementMaps[ele.type] = ele
      }
    }

    /**
     * handle isInline and isVoid
     */
    withFns.push((editor) => {
      const { isInline } = editor
      editor.isInline = (element) => {
        return inlineTypes.includes(element.type) ? true : isInline(element)
      }

      editor.isVoid = (element) => {
        return voidTypes.includes(element.type) ? true : isInline(element)
      }

      editor.elementMaps = elementMaps
      editor.onKeyDownFns = onKeyDownFns

      return editor
    })

    return { withFns, rules }
  }
}

function isBooleanTrue(value: any): value is true {
  return typeof value === 'boolean' && value === true
}
