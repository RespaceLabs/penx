import { renderList } from '@penxio/extension-api'

renderList([
  {
    title: 'hack news 1...',
    actions: [
      {
        type: 'OpenInBrowser',
        url: 'https://www.google.com',
      },
    ],
  },
  {
    title: 'world',
    actions: [
      {
        type: 'CopyToClipboard',
        content: 'hello world',
      },
    ],
  },
])
