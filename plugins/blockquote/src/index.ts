import { PluginContext } from '@penx/plugin-typings'
import { ElementType } from '../custom-types'
import { Blockquote } from './BlockQuote'

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
