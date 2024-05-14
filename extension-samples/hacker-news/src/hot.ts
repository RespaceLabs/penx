import { input, renderList } from 'penx'

renderList([
  {
    title: 'hack news 1...x',
    actions: [
      {
        type: 'OpenInBrowser',
        url: 'https://www.google.com',
      },
      {
        type: 'CopyToClipboard',
        content: 'hello world',
      },
    ],
  },
  {
    title: 'world',
  },
])
