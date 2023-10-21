import { nanoid } from 'nanoid'
import { DocStatus, IDoc } from '@penx/types'

const EDITOR_CONTENT = [
  {
    id: nanoid(),
    type: 'node',
    children: [
      {
        type: 'p',
        id: nanoid(),
        children: [{ text: 'A page' }],
      },
    ],
  },
]

export function getNewDoc(spaceId: string): IDoc {
  return {
    id: nanoid(),
    spaceId,
    title: 'Untitled',
    content: JSON.stringify(EDITOR_CONTENT),
    status: DocStatus.NORMAL,
    openedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
