import { ELEMENT_P } from '@penx/constants'
import { INode, NodeType } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

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
    id: uniqueId(),
    type: NodeType.COMMON,
    element: [
      {
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
