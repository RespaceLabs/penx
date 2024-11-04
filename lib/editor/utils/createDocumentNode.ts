import { Element } from 'slate'

export const createDocumentNode = (type = 'p', text = ''): Element[] => [
  {
    children: [
      {
        type,
        children: [{ text }],
      },
    ],
  } as Element,
]
