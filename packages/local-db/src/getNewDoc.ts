import { nanoid } from 'nanoid'
import { IDoc } from './IDoc'

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
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
