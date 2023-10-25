import { ExtensionContext } from '@penx/extension-typings'
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from './constants'
import { onKeyDown } from './onKeyDown'
import { List } from './ui/List'
import { ListItem } from './ui/ListItem'
import { ListItemContent } from './ui/ListItemContent'
import { Title } from './ui/Title'
import { withListsPlugin } from './withListsPlugin'

export * from './types'
export * from './guard'
export * from './constants'
export * from './transforms/insertEmptyList'
export * from './transforms/insertEmptyListItem'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withListsPlugin,
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
  })
}
