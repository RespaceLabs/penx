import { ELEMENT_P } from '@penx/constants'
import { INode, NodeType } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

type Input = {
  spaceId: string
  parentId?: string
  type?: NodeType
  name?: string
  props?: INode['props']
  date?: string
  element?: any[]
}

export function getNewNode(input: Input): INode {
  return {
    id: uniqueId(),
    type: NodeType.COMMON,
    props: input.props || {},
    collapsed: false,
    folded: true,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...input,
  } as INode
}
