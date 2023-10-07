import { ExtensionContext } from '@penx/extension-typings'
import { Blockquote } from './BlockQuote'
import { ElementType } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        type: ElementType.blockquote,
        component: Blockquote,
        slashCommand: {
          name: 'Blockquote',
        },
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ElementType.blockquote,
        match: '> ',
      },
    ],
  })
}
