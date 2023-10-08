import { ExtensionContext } from '@penx/extension-typings'
import { Blockquote } from './BlockQuote'
import { ELEMENT_BLOCKQUOTE } from './constants'

export { ELEMENT_BLOCKQUOTE }

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        type: ELEMENT_BLOCKQUOTE,
        component: Blockquote,
        slashCommand: {
          name: 'Blockquote',
        },
      },
    ],
    autoformatRules: [
      {
        mode: 'block',
        type: ELEMENT_BLOCKQUOTE,
        match: '> ',
      },
    ],
  })
}
