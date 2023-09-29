import { PluginContext } from '@penx/plugin-typings'
import { withAutoNodeId } from './withAutoNodeId'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withAutoNodeId,
  })
}
