import { useMemo } from 'react'
import { css } from '@fower/react'
import { Editor, Element } from 'slate'
import { useSelected, useSlate, useSlateStatic } from 'slate-react'
import { isCollapsed } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { useCompositionData } from './useCompositionData'

/**
 * Get placeholder className
 * @param element
 * @param placeholder
 * @returns className
 */
export function usePlaceholder(
  element: Element,
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
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === ElementType.td,
    })
    if (cell) return false

    // in codeblock or front matter
    const match = Editor.above(editor, {
      match: (n) => [ElementType.code_block].includes(n.type),
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
  return className
}
