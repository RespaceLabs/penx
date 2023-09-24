import { PluginContext } from '@penx/plugin-typings'

export function activate(ctx: PluginContext) {
  console.log('gogo.....xx:', ctx)
  ctx.createSettings([])

  ctx.registerCommand('hello-world', () => {
    //
  })
}
