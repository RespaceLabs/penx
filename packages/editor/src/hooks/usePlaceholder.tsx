import { useMemo } from 'react'
import { css } from '@fower/react'
import { Editor, Element } from 'slate'
import { useSelected, useSlateStatic } from 'slate-react'
import { isCodeBlock } from '@penx/code-block'
import { useCompositionData } from '@penx/editor-composition'
import { isCollapsed } from '@penx/editor-queries'
import { isTable, isTableCell } from '@penx/table'

/**
 * Get placeholder className
 * @param element
 * @param placeholder
 * @returns className
 */
export function usePlaceholder(
  element: any,
  placeholder = "Type '/' to browse options",
) {
  const { compositionData } = useCompositionData(element.id)
  const selected = useSelected()
  const editor = useSlateStatic()
  const isEmptyBlock = Editor.isEmpty(editor, element)

  let isShow = (() => {
    if (!isEmptyBlock) return false
    if (compositionData) return false
    if (!isCollapsed(editor.selection)) return false
    if (!selected) return false

    // in table, don't show placeholder
    const [cell] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && isTableCell(n),
    })
    if (cell) return false

    // in codeblock
    const match = Editor.above(editor, {
      match: (n) => isTable(n) || isCodeBlock(n),
    })

    if (match?.[0]) {
      return false
    }

    return true
  })()

  const className = useMemo(
    () =>
      css({
        '::before': {
          content: `"${placeholder}"`,
          gray200: true,
          breakNormal: true,
          display: isShow ? 'block' : 'none',
          absolute: true,
          top: '50%',
          transform: 'translate(0, -50%)',
          whiteSpace: 'nowrap',
          cursorText: true,
        },
      }),
    [isShow, placeholder],
  )
  return { className, isShow }
}
