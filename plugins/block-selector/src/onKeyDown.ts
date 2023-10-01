import { someNode } from '@penx/editor-queries'
import { OnKeyDown } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { keyDownEmitter } from './keyDownEmitter'

export const onKeyDown: OnKeyDown = (editor, e) => {
  // if block selector popover is open
  const somePopoverNode = () =>
    someNode(editor, {
      match: (n) => [ElementType.block_selector].includes(n.type),
    })

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
    case 'Enter':
      if (somePopoverNode()) {
        e.preventDefault()
        keyDownEmitter.emit('Enter')
      }

      break
  }
}
