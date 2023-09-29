import { PluginContext } from '@penx/plugin-typings'
import { CheckListItem } from './CheckListItem'
import { withCheckList } from './withCheckList'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withCheckList,
    elements: [
      {
        name: 'Check List',
        type: 'check_list_item',
        component: CheckListItem,
      },
    ],
  })
}
