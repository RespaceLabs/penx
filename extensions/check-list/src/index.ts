import { CheckSquare2 } from 'lucide-react'
import { Editor } from 'slate'
import { ELEMENT_CHECK_LIST_ITEM } from '@penx/constants'
import { setNodes } from '@penx/editor-transforms'
import { ExtensionContext } from '@penx/extension-typings'
import { CheckListItem } from './CheckListItem'
import { CheckListItemElement } from './types'
import { withCheckList } from './withCheckList'

export { ELEMENT_CHECK_LIST_ITEM }

export * from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withCheckList,
    elements: [
      {
        type: ELEMENT_CHECK_LIST_ITEM,
        component: CheckListItem,
        placeholder: '',
        slashCommand: {
          name: 'To-do',
          icon: CheckSquare2,
          description: 'Track tasks with to-do list',
        },
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_CHECK_LIST_ITEM,
        match: '[] ',
      },
      {
        mode: 'block',
        type: ELEMENT_CHECK_LIST_ITEM,
        match: '[x] ',
        format: (editor) => {
          setNodes(
            editor,
            {
              type: ELEMENT_CHECK_LIST_ITEM,
              checked: true,
            } as CheckListItemElement,
            { match: (n: any) => Editor.isBlock(editor, n) },
          )
        },
      },
    ],
  })
}
