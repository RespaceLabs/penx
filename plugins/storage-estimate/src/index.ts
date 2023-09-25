import { PluginContext } from '@penx/plugin-typings'
import { StorageEstimateView } from './StorageEstimateView'

export function activate(ctx: PluginContext) {
  ctx.registerComponent({
    at: 'status_bar',
    component: StorageEstimateView,
  })
}
