import { input, registerCommand, renderList } from '@penx/extension-api'

console.log('hello..............99')

registerCommand('hello', async () => {
  renderList([
    {
      title: 'hello...',
    },
    {
      title: 'world',
    },
  ])
})
