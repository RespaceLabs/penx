import { CompositionEvent } from 'react'
import { Editor } from 'slate'
import { getCurrentNode } from '@penx/editor-queries'
import { mutateCompositionData } from './useCompositionData'

export function useOnCompositionEvent(editor: Editor) {
  return (e: CompositionEvent<HTMLDivElement>) => {
    const currentNode = getCurrentNode(editor)!
    mutateCompositionData(currentNode.id, e.data)
  }
}
