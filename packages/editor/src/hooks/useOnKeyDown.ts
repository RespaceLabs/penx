import { KeyboardEvent, useCallback } from 'react'
import { Editor } from 'slate'
import { onKeyDown } from 'slate-lists'
import { someNode } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { keyDownEmitter } from '../utils/keyDownEmitter'

export function useOnKeyDown(editor: Editor) {
  // if popover is open
  const somePopoverNode = useCallback(
    () =>
      someNode(editor, {
        match: (n) =>
          [
            ElementType.block_selector,
            ElementType.mention_input,
            'internal_link_selector',
          ].includes(n.type),
      }),
    [editor],
  )

  return (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown(editor, e)

    switch (e.key) {
      case 'ArrowUp':
        if (somePopoverNode()) {
          e.preventDefault()
          keyDownEmitter.emit('ArrowUp')
        }

        break
      case 'ArrowDown':
        if (somePopoverNode()) {
          e.preventDefault()
          keyDownEmitter.emit('ArrowDown')
        }

        break
      case 'Tab':
        return
      case 'Enter':
        if (somePopoverNode()) {
          e.preventDefault()
          keyDownEmitter.emit('Enter')
        }

        break
    }
  }
}
