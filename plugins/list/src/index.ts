import { AutoformatBlockRule } from '@udecode/plate-autoformat'
import { Editor, Element, Transforms } from 'slate'
import { ListsEditor, ListType } from 'slate-lists'
import { unwrapList } from 'slate-lists/src/transformations'
import { PluginContext } from '@penx/plugin-typings'
import { List } from './List'
import { ListItem } from './ListItem'
import { ListItemContent } from './ListItemContent'
import { onKeyDown } from './onKeyDown'
import { ElementType } from './types'
import { listSchema, withListsPlugin } from './withListsPlugin'

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

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withListsPlugin as any,
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        type: ElementType.ul,
        component: List,
        slashCommand: {
          name: 'Unordered List',
        },
      },
      {
        type: ElementType.ol,
        component: List,
        slashCommand: {
          name: 'Ordered List',
        },
      },
      {
        type: ElementType.li,
        component: ListItem,
      },
      {
        type: ElementType.lic,
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
