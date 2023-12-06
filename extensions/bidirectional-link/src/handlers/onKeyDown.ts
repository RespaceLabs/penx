import { someNode } from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { isBidirectionalLinkSelector } from '../isBidirectionalLinkSelector'
import { keyDownEmitter } from '../keyDownEmitter'

export const onKeyDown: OnKeyDown = (editor, e) => {
  // if block selector popover is open
  const somePopoverNode = () =>
    someNode(editor, {
      match: (n) => isBidirectionalLinkSelector(n),
    })

  const isOpened = editor.isBidirectionalLinkSelector

  const { key } = e

  switch (key) {
    case 'ArrowUp':
      if (isOpened) {
        e.preventDefault()
        keyDownEmitter.emit('ArrowUp')
      }

      break
    case 'ArrowDown':
      if (isOpened) {
        e.preventDefault()
        keyDownEmitter.emit('ArrowDown')
      }

      break
    case 'Enter':
      if (isOpened) {
        e.preventDefault()
        keyDownEmitter.emit('Enter')
      }

      break
  }
}
