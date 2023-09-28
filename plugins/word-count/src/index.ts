import { PluginContext } from '@penx/plugin-typings'
import { WordCountView } from './WordCountView'

export function activate(ctx: PluginContext) {
  ctx.registerComponent({
    at: 'status_bar',
    component: WordCountView,
  })
}
