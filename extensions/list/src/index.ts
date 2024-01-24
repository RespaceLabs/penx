import { Editor, Element, Transforms } from 'slate'
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_TITLE,
  ELEMENT_UL,
  isExtension,
} from '@penx/constants'
import { getCurrentPath, getNodeByPath } from '@penx/editor-queries'
import { ExtensionContext } from '@penx/extension-typings'
import { onKeyDown } from './onKeyDown'
import { withCopy } from './plugins/withCopy'
import { withEditable } from './plugins/withEditable'
import { withListsPlugin } from './plugins/withListsPlugin'
import { withMarkdown } from './plugins/withMarkdown'
import { withPaste } from './plugins/withPaste'
import { insertEmptyList } from './transforms/insertEmptyList'
import { List } from './ui/List'
import { ListItem } from './ui/ListItem'
import { ListItemContent } from './ui/ListItemContent'
import { SortableListItemContent } from './ui/SortableListItemContent'
import { Title } from './ui/Title/Title'

export * from './types'
export * from './guard'
export * from './listSchema'
export * from './transforms/insertEmptyList'
export * from './transforms/insertEmptyListItem'
export * from './transforms/insertEmptyParagraph'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    // for web
    with: [withListsPlugin, withMarkdown, withEditable, withCopy],

    // for extension
    // with: [withListsPlugin, withEditable, withPaste, withCopy],
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        type: ELEMENT_TITLE,
        component: Title,
        placeholder: 'Untitled',
      },
      {
        type: ELEMENT_UL,
        component: List,
      },
      {
        type: ELEMENT_OL,
        component: List,
      },
      {
        type: ELEMENT_LI,
        component: ListItem,
      },
      {
        type: ELEMENT_LIC,
        component: SortableListItemContent,
        // component: ListItemContent,
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_LI,
        match: ['* ', '+ ', '- '],
        // preFormat: clearBlockFormat,
        format: (editor) => {
          const block = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n as Element),
          })

          const at = block ? block[1] : []
          Transforms.removeNodes(editor, { at })
          insertEmptyList(editor, { select: true })
        },
      },
      {
        mode: 'block',
        type: ELEMENT_LI,
        match: ['1. ', '1) '],
        format: (editor) => {
          const block = Editor.above(editor, {
            match: (n) => Editor.isBlock(editor, n as Element),
          })

          const at = block ? block[1] : []
          Transforms.removeNodes(editor, { at })
          insertEmptyList(editor, { select: true })
        },
      },
    ],
  })
}
