import { PluginContext } from '@penx/plugin-typings'
import { Blockquote } from './BlockQuote'
import { ElementType } from './types'

export function activate(ctx: PluginContext) {
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
