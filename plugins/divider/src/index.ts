import { PluginContext } from '@penx/plugin-typings'
import { Divider } from './Divider'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    elements: [
      {
        isVoid: true,
        name: 'Divider',
        type: 'hr',
        component: Divider,
      },
    ],
  })
}
