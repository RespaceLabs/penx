import { Editor } from 'slate'
import { mutate, useStore } from 'stook'

const key = 'editor'

export function useEditor() {
  const [editor, setEditor] = useStore<Editor>(key)
  return { editor, setEditor }
}

export function storeEditor(editor: Editor) {
  mutate(key, editor)
}
