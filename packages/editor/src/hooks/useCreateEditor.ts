import { ElementType, useMemo, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { createEditor, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { EditorPlugin, PluginElement } from '@penx/editor-types'
import { OnKeyDown } from '@penx/plugin-typings'
import { pluginStoreAtom } from '@penx/store'

export function useCreateEditor(plugins: EditorPlugin[] = []): Editor {
  const pluginStore = useAtomValue(pluginStoreAtom)

  const editorRef = useRef<Editor>()
  const pluginList = useMemo(() => {
    // builtin plugins
    const withFns: ((editor: Editor) => Editor)[] = [withHistory, withReact]

    const onKeyDownFns: OnKeyDown[] = []

    let inlineTypes: ElementType[] = []
    let voidTypes: ElementType[] = []
    let elementMaps: Record<string, PluginElement> = {}

    // penx plugins
    for (const name of Object.keys(pluginStore)) {
      const plugin = pluginStore[name]
      if (!plugin.block) continue
      const { elements = [] } = plugin.block
      if (plugin.block?.with) withFns.push(plugin.block.with)

      if (plugin.block.handlers?.onKeyDown) {
        onKeyDownFns.push(plugin.block.handlers.onKeyDown)
      }

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
      editor.onKeyDownFns = onKeyDownFns

      return editor
    })

    return withFns
  }, [pluginStore])

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
