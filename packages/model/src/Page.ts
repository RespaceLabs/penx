import { format } from 'date-fns'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_UL } from '@penx/constants'
import { INode } from '@penx/types'

export class Page {
  constructor(
    public node: INode,
    public nodes: INode[],
  ) {}

  get id(): string {
    return this.node?.id || ''
  }

  get spaceId(): string {
    return this.node.spaceId
  }

  // TODO
  get title(): string {
    return ''
  }

  get createdAt() {
    return this.node.createdAt
  }
  get updatedAt() {
    return this.node.updatedAt
  }

  get createdAtFormatted() {
    return format(this.node.createdAt, 'yyyy-MM-dd HH:mm')
  }

  get updatedAtFormatted() {
    return format(this.node.updatedAt, 'yyyy-MM-dd HH:mm')
  }

  get editorValue() {
    return [
      {
        type: ELEMENT_UL,
        children: this.nodes.map((node) => {
          return {
            type: ELEMENT_LI,
            children: [
              {
                type: ELEMENT_LIC,
                children: [node.element],
              },
            ],
          }
        }),
      },
    ]
  }
}
