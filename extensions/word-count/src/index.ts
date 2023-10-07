import { ExtensionContext } from '@penx/extension-typings'
import { WordCountView } from './WordCountView'

export function activate(ctx: ExtensionContext) {
  ctx.registerComponent({
    at: 'status_bar',
    component: WordCountView,
  })
}
