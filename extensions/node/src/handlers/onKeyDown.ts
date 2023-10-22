import { Editor, liftNodes, Transforms } from 'slate'
import { getCurrentPath } from '@penx/editor-queries'
import { OnKeyDown } from '@penx/extension-typings'
import { getEmptyParagraph } from '@penx/paragraph'
import { isNode } from '../isNode'
import { NodeElement } from '../types'

export const onKeyDown: OnKeyDown = (editor, e) => {
  const { key, shiftKey } = e

  if (shiftKey && key === 'Tab') {
    console.log('shift+tab')

    return
  }

  if (key === 'Tab') {
    console.log('tab')
    const [entry] = Editor.nodes(editor, {
      mode: 'highest',
      match: (n) => !Editor.isEditor(n) && isNode(n),
    })

    const nodePath = entry[1]

    Transforms.moveNodes(editor, {
      at: nodePath,
      // match: (node: any) => node.id === activeId,
      to: [0, 1],
    })

    return
  }

  if (key === 'Enter') {
    const path = getCurrentPath(editor)!
    const parent = path.slice(0, -2)

    parent[parent.length - 1] = parent[parent.length - 1] + 1

    e.preventDefault()
    Transforms.insertNodes(
      editor,
      {
        type: 'node',
        children: [getEmptyParagraph()],
      } as NodeElement,
      {
        at: parent,
        select: true,
      },
    )

    return
  }
}
