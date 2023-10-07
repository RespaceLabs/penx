import { ExtensionContext } from '@penx/extension-typings'
import { StorageEstimateView } from './StorageEstimateView'

export function activate(ctx: ExtensionContext) {
  ctx.registerComponent({
    at: 'status_bar',
    component: StorageEstimateView,
  })
}
