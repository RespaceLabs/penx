import { nanoid } from 'nanoid'
import { IDoc } from './interfaces/IDoc'

const EDITOR_CONTENT = [
  {
    type: 'p',
    id: nanoid(),
    children: [{ text: 'A page' }],
  },
]

export function getNewDoc(spaceId: string): IDoc {
  return {
    id: nanoid(),
    spaceId,
    title: 'Untitled',
    content: JSON.stringify(EDITOR_CONTENT),
    openedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
