import { PluginContext } from '@penx/plugin-typings'

export function activate(ctx: PluginContext) {
  ctx.registerCommand('hello-world', () => {
    console.log('hello world...')
  })
}
