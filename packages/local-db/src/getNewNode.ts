import { nanoid } from 'nanoid'
import { ELEMENT_P } from '@penx/constants'
import { INode, NodeStatus } from '@penx/types'

export function getNewNode(spaceId: string, text = ''): INode {
  return {
    id: nanoid(),
    spaceId,
    element: {
      id: nanoid(),
      type: ELEMENT_P,
      children: [{ text }],
    },
    props: {},
    status: NodeStatus.NORMAL,
    collapsed: false,
    children: [],
    openedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
