'use client'

import { ELEMENT_TITLE } from '@/lib/constants'
import { NodeType, ObjectType } from '@/lib/model'
import { TElement } from '@udecode/plate-common'
import { createPlatePlugin } from '@udecode/plate-common/react'
import { Editor, Element, Node, Path } from 'slate'
import { insertEmptyParagraph } from '../lib/insertEmptyParagraph'

export interface ITitleElement extends TElement {
  id?: string
  type: typeof ELEMENT_TITLE
  nodeType?: NodeType
  date?: string
  props: {
    objectType: ObjectType
    date: string
    color: string
    imageUrl: string
    coverUrl: string
  }
}

export function isTitle(node: any): node is ITitleElement {
  return node?.type === ELEMENT_TITLE
}

function onEnterInTitle(editor: any, titlePath: Path) {
  const nextPath = Path.next(titlePath)
  insertEmptyParagraph(editor, { select: true, at: nextPath })
}

const TitlePlugin = createPlatePlugin({
  key: 'title',
  node: { isElement: true },
  options: {},
  handlers: {
    onKeyDown({ editor, event }) {
      const [titleNodeEntry] = Editor.nodes(editor as any, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && isTitle(n),
      })

      if (!titleNodeEntry) return

      const titleNode = titleNodeEntry[0] as ITitleElement

      if (event.key === 'Enter') {
        if (
          [
            NodeType.DAILY_ROOT,
            NodeType.DATABASE_ROOT,
            NodeType.DATABASE,
          ].includes(titleNode.nodeType!)
        ) {
          return event.preventDefault()
        }

        onEnterInTitle(editor, titleNodeEntry[1])
        return event.preventDefault()
      } else {
        if (
          [
            NodeType.DAILY,
            NodeType.DAILY_ROOT,
            NodeType.DATABASE_ROOT,
          ].includes(titleNode.nodeType!)
        ) {
          return event.preventDefault()
        }

        if (event.key === 'Backspace' && Node.string(titleNode).length === 0) {
          return event.preventDefault()
        }
      }
    },
  },
})

export const titlePlugin = TitlePlugin
