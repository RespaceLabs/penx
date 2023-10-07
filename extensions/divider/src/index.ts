import { Transforms } from 'slate'
import { setNodes } from '@penx/editor-transforms'
import { ExtensionContext } from '@penx/extension-typings'
import { insertEmptyParagraph } from '@penx/paragraph'
import { Divider } from './Divider'
import { DividerElement, ElementType } from './types'

export function activate(ctx: ExtensionContext) {
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
          setNodes<DividerElement>(editor, { type: ElementType.hr })
          insertEmptyParagraph(editor)
        },
      },
    ],
  })
}
