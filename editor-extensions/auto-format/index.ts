import { ExtensionContext } from '@/lib/extension-typings'
import { marks } from './marks'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    autoformatRules: [...marks],
  })
}
