import { useCallback } from 'react'
import { Element, Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import { findNode, findNodePath } from '@penx/editor-queries'
import { setSelectedNode } from './useSelectedNode'

export function useClickElement(element: Element) {
  const editor = useSlateStatic()

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      const at = findNodePath(editor, element)

      Transforms.setNodes(
        editor,
        { selected: false },
        {
          at: [],
          match: (n: any) => !!n.selected,
        },
      )

      Transforms.setNodes(editor, { selected: true }, { at })

      const entry = findNode(editor, { match: (n: any) => n.selected })

      if (Array.isArray(entry)) {
        setSelectedNode(null) // TODO: for form rerender
        setTimeout(() => {
          setSelectedNode(entry[0])
        }, 0)
      }
    },
    [element, editor],
  )
  return onClick
}
