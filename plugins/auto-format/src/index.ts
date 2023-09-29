import { PluginContext } from '@penx/plugin-typings'
import { withAutoformat } from './withAutoformat'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withAutoformat,
  })
}
