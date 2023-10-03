import { useRef } from 'react'
import { withAutoformat } from '@udecode/plate-autoformat'
import { createEditor, Editor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { usePluginStore } from '@penx/hooks'

export function useCreateEditor(): Editor {
  const { pluginStore } = usePluginStore()
  const editorRef = useRef<Editor>()
  const { rules } = pluginStore

  const withFns = [withHistory, withReact, ...pluginStore.withFns]

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

  return editorRef.current as Editor
}
