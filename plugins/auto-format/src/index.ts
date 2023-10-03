import { PluginContext } from '@penx/plugin-typings'
import { marks } from './marks'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    autoformatRules: [...marks],
  })
}
