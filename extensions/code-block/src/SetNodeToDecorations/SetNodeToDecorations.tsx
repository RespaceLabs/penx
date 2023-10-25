import { Editor, Element } from 'slate'
import { useEditor } from '@penx/editor-common'
import { isCodeBlock } from '../guard'
import { getChildNodeToDecorations } from './getChildNodeToDecorations'

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>()

  for (const m of maps) {
    for (const item of m) {
      map.set(...item)
    }
  }

  return map
}

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export const SetNodeToDecorations = () => {
  // should use useSlate to rerender
  const editor = useEditor()

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: (n) => Element.isElement(n) && isCodeBlock(n),
    }),
  )

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map((item) => getChildNodeToDecorations(item as any)),
  )

  editor.nodeToDecorations = nodeToDecorations

  return null
}
