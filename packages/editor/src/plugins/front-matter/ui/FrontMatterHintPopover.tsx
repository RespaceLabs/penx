import { memo, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { Portal } from 'bone-ui'
import { Editor, Element, Node, Transforms } from 'slate'
import { ReactEditor, useSlate, useSlateStatic } from 'slate-react'
import { MenuItem } from 'uikit'
import {
  getCurrentFocus,
  getCurrentNode,
  getCurrentPath,
} from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { hints } from '../hints'
import { useKeyDownList } from './useKeyDownList'

function isWord(word: string): boolean {
  const regex = /^[A-Za-z_]+$/
  return regex.test(word)
}

export const FrontMatterHintPopover = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const editor = useSlateStatic()
  const node = getCurrentNode(editor)

  const str = Node.string(node!)

  const filteredHints = hints.filter((hint) => {
    if (!isWord(str)) return false
    return hint.startsWith(str)
  })

  const { cursor, setCursor } = useKeyDownList({
    onEnter(i) {
      if (!filteredHints.length) return
      // TODO: should use reg
      const text = filteredHints[i]?.replace(str, '') + ': '
      Transforms.insertText(editor, text)
      const el = ref.current!
      el.removeAttribute('style')
      el.classList.remove('front-matter-hint-open')
      setCursor(0)
    },
    listLength: filteredHints.length,
    listItemIdPrefix: 'hint-popover-',
  })

  useEffect(() => {
    const { selection } = editor
    const el = ref.current

    if (!el) return

    if (!selection || !ReactEditor.isFocused(editor)) {
      el.removeAttribute('style')
      el.classList.remove('front-matter-hint-open')
      return
    }

    const block = Editor.above(editor, {
      match: (n) =>
        Editor.isBlock(editor, n as Element) &&
        n.type === ElementType.front_matter_line,
    })

    if (!block) {
      el.removeAttribute('style')
      return
    }

    const focus = getCurrentFocus(editor)!
    const isEndOfLine = Editor.isEnd(editor, focus, block?.[1]!)

    if (!isEndOfLine || !Node.string(block?.[0]!).length) {
      el.removeAttribute('style')
      return
    }

    if (!isWord(str)) {
      el.removeAttribute('style')
      return
    }

    const find = hints.find((hint) => hint === str)

    if (find) {
      el.removeAttribute('style')
      return
    }

    if (!filteredHints.length) {
      el.removeAttribute('style')
      return
    }

    // console.log('filteredHints:', filteredHints)

    const domSelection = window.getSelection()!
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()

    el.style.opacity = '1'
    el.style.top = `${rect.top + 24}px`
    el.style.left = `${rect.left + window.pageXOffset}px`

    el.classList.add('front-matter-hint-open')
  })

  return (
    <Portal>
      <Box
        ref={ref}
        column
        absolute
        top--10000
        left--10000
        mt-0
        maxW-360
        minW-100
        zIndex-100
        outlineNone
        shadow="0 0 0 1px rgba(0,0,0,.08),0px 1px 1px rgba(0,0,0,.02),0px 4px 8px -4px rgba(0,0,0,.04),0px 16px 24px -8px rgba(0,0,0,.06)"
        rounded
        bgWhite
        bgGray800--dark
        overflowHidden
        transitionCommon
      >
        {filteredHints.map((item, index) => (
          <MenuItem
            key={item}
            bgGray100={index === cursor}
            onClick={() => {
              Transforms.insertText(editor, item)
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Box>
    </Portal>
  )
}
