import { Editor, Element, Transforms } from 'slate'
import { ListsEditor, ListType } from 'slate-lists'
import { unwrapList } from 'slate-lists/src/transformations'
import { AutoformatBlockRule } from '@penx/autoformat'
import { ExtensionContext } from '@penx/extension-typings'
import { listSchema } from './listSchema'
import { onKeyDown } from './onKeyDown'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from './types'
import { List } from './ui/List'
import { ListItem } from './ui/ListItem'
import { ListItemContent } from './ui/ListItemContent'
import { withListsPlugin } from './withListsPlugin'
import { withSplitList } from './withSplitList'

export * from './types'

const preFormat: AutoformatBlockRule['preFormat'] = (editor: any) =>
  unwrapList(editor, listSchema)

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

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    // with: [withListsPlugin, withSplitList],
    with: withListsPlugin,
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        type: ELEMENT_UL,
        component: List,
        slashCommand: {
          name: 'Unordered List',
        },
      },
      {
        type: ELEMENT_OL,
        component: List,
        slashCommand: {
          name: 'Ordered List',
        },
      },
      {
        type: ELEMENT_LI,
        component: ListItem,
      },
      {
        type: ELEMENT_LIC,
        component: ListItemContent,
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: 'li',
        match: ['* ', '+ ', '- '],
        preFormat,
        format: (editor) => {
          formatListNode(editor, ListType.UNORDERED)
        },
      },

      {
        mode: 'block',
        type: 'li',
        match: ['1. ', '1) '],
        preFormat,
        format: (editor) => {
          formatListNode(editor, ListType.ORDERED)
        },
      },
    ],
  })
}
