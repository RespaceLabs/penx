import { useRef } from 'react'
import { withAutoformat } from '@udecode/plate-autoformat'
import { createEditor, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { withListsReact } from 'slate-lists'
import { withReact } from 'slate-react'
import { usePluginStore } from '@penx/hooks'

export function useCreateEditor() {
  const { pluginStore } = usePluginStore()
  const editorRef = useRef<Editor>()
  const { rules, inlineTypes, voidTypes, elementMaps, onKeyDownFns } =
    pluginStore

  const withFns: ((editor: Editor) => any)[] = [
    withHistory,
    withReact,
    withListsReact as any,
    ...pluginStore.withFns,
  ]

  /**
   * handle isInline and isVoid
   * TODO: handle
   */
  withFns.push((editor: any) => {
    const { isInline } = editor
    editor.isInline = (element: any) => {
      return inlineTypes.includes(element.type) ? true : isInline(element)
    }

    editor.isVoid = (element: any) => {
      return voidTypes.includes(element.type) ? true : isInline(element)
    }

    editor.elementMaps = elementMaps
    editor.onKeyDownFns = onKeyDownFns

    return editor
  })

  if (!editorRef.current) {
    const editor = withFns.reduce<any>(
      (wrappedEditor, plugin) => plugin(wrappedEditor),
      createEditor(),
    )

    // handle autoformat
    editorRef.current = withAutoformat(editor, {
      key: 'AUTO_FORMAT',
      options: { rules },
    } as any)
  }

  /**
   * TODO: for debug
   */
  if (typeof window !== 'undefined') {
    ;(window as any).__editor = editorRef.current
  }

  // if (editorRef.current) storeEditor(editorRef.current)

  return editorRef.current!
}
