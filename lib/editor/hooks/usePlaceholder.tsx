import { useMemo } from 'react'
import { isCodeBlock } from '@/editor-extensions/code-block'
import { isTitle } from '@/editor-extensions/list'
import { isTable, isTableCell } from '@/editor-extensions/table'
import { useCompositionData } from '@/lib/editor-composition'
import { isCollapsed } from '@/lib/editor-queries'
import { cn } from '@/lib/utils'
import { Editor, Element } from 'slate'
import { useSelected, useSlateStatic } from 'slate-react'

/**
 * Get placeholder className
 * @param element
 * @param placeholder
 * @returns className
 */
export function usePlaceholder(
  element: any,
  // placeholder = "Type '/' to browse options",
  placeholder = '',
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

    // should not show
    const match = Editor.above(editor, {
      match: (n) => isTable(n) || isCodeBlock(n) || isTitle(n),
    })

    if (match?.[0]) {
      return false
    }

    return true
  })()

  const type = element.type

  function getContent() {
    if (type === 'h1') return `Heading 1`
    if (type === 'h2') return `Heading 2`
    if (type === 'h3') return `Heading 3`
    if (type === 'h4') return `Heading 4`
    if (type === 'h5') return `Heading 5`
    return `Type '/' to browse options`
  }

  const className = useMemo(() => {
    if (!isShow) return ''
    return cn(
      `before:content-[attr(before)] before:text-foreground/15 before:break-normal before:absolute before:left-0 before:top-1/2 before:cursor-text before:whitespace-nowrap before:-translate-y-1/2 before:block`,
    )
  }, [isShow, placeholder])
  return {
    className,
    isShow,
    before: isShow ? getContent() : undefined,
  }
}
