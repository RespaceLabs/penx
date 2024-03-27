import { CheckSquare2 } from 'lucide-react'
import { Editor } from 'slate'
import { ELEMENT_TODO } from '@penx/constants'
import { setNodes } from '@penx/editor-transforms'
import { ExtensionContext } from '@penx/extension-typings'
import { CheckListItem } from './CheckListItem'
import { onKeyDown } from './onKeyDown'
import { CheckListItemElement } from './types'
import { withCheckList } from './withCheckList'

export { ELEMENT_TODO }

export * from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withCheckList,
    handlers: {
      onKeyDown: onKeyDown,
    },
    elements: [
      {
        type: ELEMENT_TODO,
        component: CheckListItem,
        placeholder: '',
        slashCommand: {
          in: ['OUTLINER', 'BLOCK'],
          name: 'To-do',
          icon: CheckSquare2,
          description: 'Track tasks with to-do list',
        },
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_TODO,
        match: '[] ',
      },
      {
        mode: 'block',
        type: ELEMENT_TODO,
        match: '[x] ',
        format: (editor) => {
          setNodes(
            editor,
            {
              type: ELEMENT_TODO,
              checked: true,
            } as CheckListItemElement,
            { match: (n: any) => Editor.isBlock(editor, n) },
          )
        },
      },
    ],
  })
}
