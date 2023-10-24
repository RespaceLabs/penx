import { ExtensionContext } from '@penx/extension-typings'
import { onKeyDown } from './onKeyDown'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from './types'
import { List } from './ui/List'
import { ListItem } from './ui/ListItem'
import { ListItemContent } from './ui/ListItemContent'
import { withListsPlugin } from './withListsPlugin'

export * from './types'
export * from './guard'
export * from './insertEmptyListItem'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
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
  })
}
