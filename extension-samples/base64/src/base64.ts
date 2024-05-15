import { renderList } from 'penx'
import { toBase64 } from './libs/toBase64'
import { toString } from './libs/toString'

renderList([
  {
    title: 'Encode',
    icon: 'base64.svg',
    subtitle: toBase64('Hello World!!!!'),
    actions: [
      {
        type: 'CopyToClipboard',
        content: toBase64('Hello World!'),
      },
    ],
  },
  {
    title: 'Decode',
    icon: 'base64.svg',
    subtitle: toString('Hello World!'),
    actions: [
      {
        type: 'CopyToClipboard',
        content: toString('Hello World!'),
      },
    ],
  },
])
