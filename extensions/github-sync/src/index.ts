import { ExtensionContext } from '@penx/extension-typings'
import { SyncPopover } from './SyncPopover'

export function activate(ctx: ExtensionContext) {
  ctx.registerComponent({
    at: 'status_bar',
    component: SyncPopover,
  })
}
