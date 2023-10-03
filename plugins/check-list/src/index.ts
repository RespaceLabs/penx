import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { CheckListItem } from './CheckListItem'
import { withCheckList } from './withCheckList'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withCheckList,
    elements: [
      {
        type: ElementType.check_list_item,
        component: CheckListItem,
        slashCommand: {
          name: 'Check List',
        },
      },
    ],
  })
}
