import { setNodes } from '@penx/editor-transforms'
import { ExtensionContext } from '@penx/extension-typings'
import { insertEmptyParagraph } from '@penx/paragraph'
import { Divider } from './Divider'
import { DividerElement, ELEMENT_HR } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        type: ELEMENT_HR,
        component: Divider,
        // slashCommand: {
        //   name: 'Divider',
        //   afterInvokeCommand(editor) {
        //     insertEmptyParagraph(editor)
        //   },
        // },
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_HR,
        match: '---',
        format: (editor) => {
          setNodes<DividerElement>(editor, { type: ELEMENT_HR })
          // insertEmptyParagraph(editor)
        },
      },
    ],
  })
}
