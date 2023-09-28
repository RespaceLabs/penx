import { ElementType, useMemo, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { createEditor, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { EditorPlugin, PluginElement } from '@penx/editor-types'
import { pluginStoreAtom } from '@penx/store'

export function useCreateEditor(plugins: EditorPlugin[] = []): Editor {
  const pluginStore = useAtomValue(pluginStoreAtom)

  const editorRef = useRef<Editor>()
  const pluginList = useMemo(() => {
    // builtin plugins
    const withFns: ((editor: Editor) => Editor)[] = [withHistory, withReact]

    let inlineTypes: ElementType[] = []
    let voidTypes: ElementType[] = []
    let elementMaps: Record<string, PluginElement> = {}

    // penx plugins
    for (const name of Object.keys(pluginStore)) {
      const plugin = pluginStore[name]
      const { elements = [] } = plugin.block || {}
      if (plugin?.block?.with) withFns.push(plugin.block.with)

      for (const ele of elements) {
        // get inline types
        if (isBooleanTrue(ele.isInline))
          inlineTypes.push(ele.type as ElementType)

        // get void types
        if (isBooleanTrue(ele.isVoid)) voidTypes.push(ele.type as ElementType)

        // set element maps
        elementMaps[ele.type] = ele
      }
    }

    // user plugin
    for (const plugin of plugins) {
      const { elements = [] } = plugin
      if (plugin.with) withFns.push(plugin.with)

      for (const ele of elements) {
        let defaultConfig: Record<string, any> = {}
        const { configSchema } = ele
        // get inline types
        if (isBooleanTrue(ele.isInline))
          inlineTypes.push(ele.type as ElementType)

        // get void types
        if (isBooleanTrue(ele.isVoid)) voidTypes.push(ele.type as ElementType)

        if (Array.isArray(configSchema)) {
          for (const item of configSchema) {
            defaultConfig[item.name] = item.defaultValue
          }
        }

        // set element maps
        elementMaps[ele.type] = {
          ...ele,
          defaultConfig: ele.defaultConfig || defaultConfig,
        }
      }
    }

    /**
     * handle isInline and isVoid
     */
    withFns.push((editor) => {
      const { isInline } = editor
      editor.isInline = (element) => {
        return inlineTypes.includes(element.type as any)
          ? true
          : isInline(element)
      }

      editor.isVoid = (element) => {
        return voidTypes.includes(element.type as any)
          ? true
          : isInline(element)
      }

      editor.elementMaps = elementMaps

      return editor
    })

    return withFns
  }, [plugins, pluginStore])

  if (!editorRef.current) {
    editorRef.current = pluginList.reduce<any>(
      (wrappedEditor, plugin) => plugin(wrappedEditor),
      createEditor(),
    )
  }

  /**
   * TODO: for debug
   */
  if (typeof window !== 'undefined') {
    ;(window as any).__editor = editorRef.current
  }

  // if (editorRef.current) storeEditor(editorRef.current)

  return editorRef.current as Editor
}

function isBooleanTrue(value: any): value is true {
  return typeof value === 'boolean' && value === true
}
