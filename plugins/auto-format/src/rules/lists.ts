import { Editor, Element, Transforms } from 'slate'
import { ListsEditor, ListType } from 'slate-lists'
import { ElementType } from '@penx/editor-shared'
import { setNodes } from '@penx/editor-transforms'
import { clearBlockFormat } from '../autoformatUtils'
import { AutoformatRule } from '../types'

function formatListNode(editor: Editor, type: ListType) {
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n as Element),
  })

  const at = block ? block[1] : []

  Transforms.removeNodes(editor, { at })
  const listNode = ListsEditor.createListNode(editor, type, {
    children: [
      ListsEditor.createListItemNode(editor, {
        children: [ListsEditor.createListItemTextNode(editor, {})],
      }),
    ],
  })

  Transforms.insertNodes(editor, listNode, { at })
  Transforms.select(editor, Editor.start(editor, at))
}

export const lists: AutoformatRule[] = [
  {
    mode: 'block',
    type: 'li',
    match: ['* ', '+ ', '- '],
    preFormat: clearBlockFormat,
    format: (editor) => {
      formatListNode(editor, ListType.UNORDERED)
    },
  },
  {
    mode: 'block',
    type: 'li',
    match: ['1. ', '1) '],
    preFormat: clearBlockFormat,
    format: (editor) => {
      formatListNode(editor, ListType.ORDERED)
    },
  },

  {
    mode: 'block',
    type: ElementType.check_list_item,
    match: '[] ',
  },
  {
    mode: 'block',
    type: ElementType.check_list_item,
    match: '[x] ',
    format: (editor) => {
      setNodes(
        editor,
        { type: ElementType.check_list_item, checked: true },
        { match: (n) => Editor.isBlock(editor, n as any) },
      )
    },
  },
]
