import { memo, useEffect, useRef } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { Portal } from 'uikit'
import { isCodeLine } from '@penx/code-block'
import { useEditor } from '@penx/editor-common'
import { ElementType, MarkType } from '@penx/editor-shared'
import { FormatButton } from './FormatButton'

const ToolbarContentMemoized = memo(
  function ToolbarContent(props: { attr: { ref: any } }) {
    return (
      <Portal>
        <Box
          ref={props.attr.ref}
          toLeft
          absolute
          top--10000
          left--10000
          mt-0
          zIndex-100
          shadow
          rounded
          bgWhite
          overflowHidden
          transitionCommon
        >
          {[
            MarkType.bold,
            MarkType.italic,
            MarkType.underline,
            MarkType.strike_through,
            ElementType.link,
          ].map((mark) => (
            <FormatButton key={mark} format={mark} />
          ))}
        </Box>
      </Portal>
    )
  },
  (prev, next) => {
    return prev.attr.ref === next.attr.ref
  },
)

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const editor = useEditor()

  useEffect(() => {
    const { selection } = editor
    const el = ref.current

    if (!el) return

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    /** hide toolbar if codeblock */
    try {
      const n1 = Node.parent(editor, selection.anchor.path)
      const n2 = Node.parent(editor, selection.focus.path)
      if (isCodeLine(n1) || isCodeLine(n2)) {
        el.style.display = 'none'
      }
    } catch (error) {}

    const domSelection = window.getSelection()!
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`
  })

  return <ToolbarContentMemoized attr={{ ref }} />
}

export default memo(HoveringToolbar)
