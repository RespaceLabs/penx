import { setNodes } from '@penx/editor-transforms'
import { insertEmptyParagraph } from '@penx/paragraph'
import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { Divider } from './Divider'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        type: ElementType.hr,
        component: Divider,
        slashCommand: {
          name: 'Divider',
          afterInvokeCommand(editor) {
            insertEmptyParagraph(editor)
          },
        },
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ElementType.hr,
        match: '---',
        format: (editor) => {
          setNodes(editor, { type: ElementType.hr })
          insertEmptyParagraph(editor)
        },
      },
    ],
  })
}
