import { PluginContext } from '@penx/plugin-typings'

export function activate(ctx: PluginContext) {
  ctx.registerCommand({
    id: 'hello-world',
    name: 'Hello World',
    handler: () => {
      console.log('ai....')
    },
  })
}
