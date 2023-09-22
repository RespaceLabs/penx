import { useCallback } from 'react'
import { Editor, Element, NodeEntry } from 'slate'
import { ElementType } from '@penx/editor-shared'

export const useDecorate = (editor: Editor) => {
  return useCallback(
    ([node]: NodeEntry) => {
      if (
        Element.isElement(node) &&
        [ElementType.code_line, ElementType.front_matter_line].includes(
          node.type,
        )
      ) {
        const ranges = editor.nodeToDecorations.get(node) || []
        return ranges
      }

      return []
    },
    [editor.nodeToDecorations],
  )
}

/**
 * should insert '/' ?
 * @param editor
 * @returns
 */

const getLength = (token: any): number => {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else {
    const content: any[] = token.content
    return content.reduce((l, t) => l + getLength(t), 0 as number)
  }
}
