import { ExtensionContext } from '@penx/extension-typings'
import { marks } from './marks'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    autoformatRules: [...marks],
  })
}
