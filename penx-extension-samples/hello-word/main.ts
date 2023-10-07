import { ExtensionContext } from '@penx/extension-typings'

export function activate(ctx: ExtensionContext) {
  ctx.registerCommand({
    id: 'hello-world',
    name: 'Hello World',
    handler: () => {
      console.log('hello world...xxx')
    },
  })
}
