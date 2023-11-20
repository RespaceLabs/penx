import { TElement } from '@udecode/plate-common'
import { Editor, Transforms } from 'slate'
import { ELEMENT_BLOCK_SELECTOR } from '@penx/constants'
import { findNode } from '@penx/editor-queries'
import { selectEditor } from '@penx/editor-transforms'
import { BlockSelectorElement } from '../types'

export function setIsOpen(editor: Editor): void {
  const isOpen = false
  const entry = findNode(editor, {
    match: (n: TElement) => n.type === ELEMENT_BLOCK_SELECTOR,
  })

  if (entry?.length) {
    const at = entry[1]

    Transforms.setNodes<BlockSelectorElement>(editor, { isOpen }, { at })

    if (!isOpen) {
      Transforms.unwrapNodes(editor, {
        at,
      })
    }

    selectEditor(editor, { focus: true, at, edge: 'end' })
  }
}
