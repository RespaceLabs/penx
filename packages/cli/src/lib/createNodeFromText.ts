import { v4 as uuidv4 } from 'uuid'
import { INode } from '../types/INode'
export function createNodeFromText(text = ''): INode {
  return {
    id: uuidv4(),
    spaceId: '',
    type: 'COMMON' as any,
    element: [
      {
        type: 'p',
        children: [{ text }],
      },
    ],

    props: {},
    collapsed: false,
    date: '',
    folded: true,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
