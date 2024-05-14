import { renderList } from 'penx'
import { toBase64 } from './libs/toBase64'
import { toString } from './libs/toString'

renderList([
  {
    title: 'Encode',
    subtitle: toBase64('Hello World!'),
    actions: [
      {
        type: 'CopyToClipboard',
        content: toBase64('Hello World!'),
      },
    ],
  },
  {
    title: 'Decode',
    subtitle: toString('Hello World!'),
    actions: [
      {
        type: 'CopyToClipboard',
        content: toString('Hello World!'),
      },
    ],
  },
])
