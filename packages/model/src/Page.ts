import { format } from 'date-fns'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_UL } from '@penx/constants'
import { INode } from '@penx/types'

export class Page {
  nodeMap = new Map<string, INode>()

  constructor(
    public node: INode,
    public pageNodes: INode[],
    public allNodes: INode[],
  ) {
    for (const node of allNodes) {
      this.nodeMap.set(node.id, node)
    }
  }

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
    const fromChildren = (children: string[]) => {
      const listItems = children
        .filter((id) => this.nodeMap.get(id))
        .map((id) => {
          const node = this.nodeMap.get(id)!
          const children = [
            {
              id: node.id,
              type: ELEMENT_LIC,
              collapsed: node.collapsed,
              children: [node.element],
            },
          ]

          if (node.children) {
            const ul = fromChildren(node.children)
            if (ul) children.push(ul as any)
          }

          return {
            type: ELEMENT_LI,
            children,
          }
        })

      if (!listItems.length) return null
      return {
        type: ELEMENT_UL,
        children: listItems,
      }
    }

    const value = [
      {
        type: ELEMENT_UL,
        children: this.pageNodes.map((node) => {
          const listChildren = [
            {
              id: node.id,
              type: ELEMENT_LIC,
              collapsed: node.collapsed,
              children: [node.element],
            },
          ]

          const ul = fromChildren(node.children) as any
          if (ul) listChildren.push(ul)

          return {
            type: ELEMENT_LI,
            children: listChildren,
          }
        }),
      },
    ]
    console.log('editorValue:', value)

    return value
  }
}
