import { input, registerCommand, renderList } from '@penx/extension-api'

console.log('hello..............9')

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
