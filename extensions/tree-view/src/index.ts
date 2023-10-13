import { ExtensionContext } from '@penx/extension-typings'
import { TreeView } from './TreeView'

export function activate(ctx: ExtensionContext) {
  ctx.registerComponent({
    at: 'side_bar',
    component: TreeView,
  })
}
