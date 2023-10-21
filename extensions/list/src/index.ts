import { Editor, Element, Node, Path, Transforms } from 'slate'
import { ListsEditor, ListType } from 'slate-lists'
import { unwrapList } from 'slate-lists/src/transformations'
import { AutoformatBlockRule } from '@penx/autoformat'
import {
  findNode,
  getCurrentFocus,
  getCurrentNode,
  getCurrentPath,
  getNodeByPath,
} from '@penx/editor-queries'
import { ExtensionContext } from '@penx/extension-typings'
import { getEmptyParagraph } from '@penx/paragraph'
import { isListElement, isListItemElement } from './guard'
import { listSchema } from './listSchema'
import { onKeyDown } from './onKeyDown'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from './types'
import { List } from './ui/List'
import { ListItem } from './ui/ListItem'
import { ListItemContent } from './ui/ListItemContent'
import { withListsPlugin } from './withListsPlugin'

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

function withMyList(editor: Editor) {
  const { apply } = editor

  // TODO: should do some validations
  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const { properties } = operation

      if (!Object.keys(properties).length) {
        return apply(operation)
      }

      apply(operation)

      const node = getCurrentNode(editor)!
      const path = getCurrentPath(editor)!

      const [listItem] = Editor.nodes(editor, {
        at: editor.selection!,
        match: isListItemElement,
      })

      // remove the splitted node
      Transforms.removeNodes(editor, { at: Path.parent(path) })

      // create a new list item base one the splitted node
      const nodeItem = listSchema.createListItemNode({
        children: [
          listSchema.createListItemTextNode({
            children: [node],
          }),
        ],
      })

      const listItemPath = listItem[1]

      const at = [
        ...Path.parent(listItemPath),
        listItemPath[listItemPath.length - 1] + 1,
      ]

      // insert a new list item
      Transforms.insertNodes(editor, nodeItem, { at })

      return
    }
    return apply(operation)
  }

  return editor
}

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: (editor) => withMyList(withListsPlugin(editor)),
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
