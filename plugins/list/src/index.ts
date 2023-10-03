import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { List } from './List'
import { ListItem } from './ListItem'
import { ListItemContent } from './ListItemContent'
import { onKeyDown } from './onKeyDown'
import { withListsPlugin } from './withListsPlugin'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withListsPlugin,
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
  })
}
