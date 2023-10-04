import { CompositionEvent } from 'react'
import { Editor } from 'slate'
import { getCurrentNode } from '@penx/editor-queries'
import { mutateCompositionData } from './useCompositionData'

export function useOnCompositionEvent(editor: Editor) {
  return (e: CompositionEvent<HTMLDivElement>) => {
    const currentNode = getCurrentNode(editor)! as any
    mutateCompositionData(currentNode.id, e.data)
  }
}
