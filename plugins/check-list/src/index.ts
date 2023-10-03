import { Editor } from 'slate'
import { setNodes } from '@penx/editor-transforms'
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
    autoformatRules: [
      {
        mode: 'block',
        type: ElementType.check_list_item,
        match: '[] ',
      },
      {
        mode: 'block',
        type: ElementType.check_list_item,
        match: '[x] ',
        format: (editor) => {
          setNodes(
            editor,
            { type: ElementType.check_list_item, checked: true },
            { match: (n: any) => Editor.isBlock(editor, n) },
          )
        },
      },
    ],
  })
}
