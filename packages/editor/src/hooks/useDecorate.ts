import { useCallback } from 'react'
import { Editor, Element, NodeEntry } from 'slate'
import { isCodeLine } from '@penx/code-block'

export const useDecorate = (editor: any) => {
  return useCallback(
    ([node]: NodeEntry) => {
      if (Element.isElement(node) && isCodeLine(node)) {
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
