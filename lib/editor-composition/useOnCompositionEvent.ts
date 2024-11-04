import { CompositionEvent } from 'react'
import { Editor } from 'slate'
import { ELEMENT_TITLE } from '@/lib/constants'
import { PenxEditor } from '@/lib/editor-common'
import { getCurrentNode } from '@/lib/editor-queries'
import { mutateCompositionData } from './useCompositionData'

export function useOnCompositionEvent(editor: PenxEditor) {
  return (e: CompositionEvent<HTMLDivElement>) => {
    const node = getCurrentNode(editor)! as any
    const isUpdate = e.type === 'compositionupdate'
    const isEnd = e.type === 'compositionend'

    const titleEntry = Editor.above(editor, {
      at: editor.selection!,
      match: (n: any) => n.type === ELEMENT_TITLE,
    })

    if (titleEntry) {
      if (isUpdate) {
        mutateCompositionData((titleEntry[0] as any).id, e.data)
      } else {
        mutateCompositionData((titleEntry[0] as any).id, '')
      }
    } else {
      if (isUpdate) {
        mutateCompositionData(node.id, e.data)
      } else {
        mutateCompositionData(node.id, '')
      }
    }

    if (isUpdate) {
      editor.isOnComposition = true
    }

    if (isEnd) {
      editor.isOnComposition = false
    }
  }
}
