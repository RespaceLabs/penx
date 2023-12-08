import { someNode } from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { isTagSelector } from '../isTagSelector'
import { keyDownEmitter } from '../keyDownEmitter'

export const onKeyDown: OnKeyDown = (editor, e) => {
  // if block selector popover is open
  const somePopoverNode = () =>
    someNode(editor, {
      match: (n) => isTagSelector(n),
    })

  // const hasTagSelector = somePopoverNode()
  const isOpened = editor.isTagSelectorOpened

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
      if (isOpened && !editor.isOnComposition) {
        e.preventDefault()
        keyDownEmitter.emit('Enter')
      }

      break
  }
}
