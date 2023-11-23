import { nanoid } from 'nanoid'
import { ELEMENT_P } from '@penx/constants'
import { INode, NodeType } from '@penx/model-types'

type Input = {
  spaceId: string
  parentId?: string
  type?: NodeType
  name?: string
  props?: INode['props']
}

export function getNewNode(input: Input, text = ''): INode {
  const { name, ...rest } = input
  return {
    id: nanoid(),
    type: NodeType.COMMON,
    element: [
      {
        id: nanoid(),
        type: ELEMENT_P,
        children: [{ text }],
      },
    ],

    props: {
      name,
      ...rest.props,
    },
    collapsed: false,
    folded: true,
    children: [],
    openedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  } as INode
}
