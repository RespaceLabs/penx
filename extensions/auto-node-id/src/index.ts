import { ExtensionContext } from '@penx/extension-typings'
import { withAutoNodeId } from './withAutoNodeId'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withAutoNodeId,
  })
}
