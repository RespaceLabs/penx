import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { onKeyDown } from './onKeyDown'
import { withEditable } from './plugins/withEditable'
import { withListsPlugin } from './plugins/withListsPlugin'
import { withMarkdown } from './plugins/withMarkdown'
import { List } from './ui/List'
import { ListItem } from './ui/ListItem'
import { SortableListItemContent } from './ui/SortableListItemContent'
import { Title } from './ui/Title/Title'

export * from './types'
export * from './guard'
export * from './listSchema'
export * from './transforms/insertEmptyList'
export * from './transforms/insertEmptyListItem'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: [withListsPlugin, withMarkdown, withEditable],
    // with: [withListsPlugin, withEditable],
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
      },
    ],
  })
}
