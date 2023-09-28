import { PluginContext } from '@penx/plugin-typings'
import { Blockquote } from './BlockQuote'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    elements: [
      {
        name: 'Blockquote',
        type: 'blockquote',
        component: Blockquote,
      },
    ],
  })
}
