import { format } from 'date-fns'
import { INode, NodeStatus, NodeType } from '@penx/types'

type Element = {
  id: string
  type: string
  children: Array<{ text: string }>
}

export const isRootNode = () => {}

export class Node {
  constructor(public raw: INode) {}

  get id(): string {
    return this.raw?.id || ''
  }

  get parentId() {
    return this.raw.parentId
  }

  get spaceId(): string {
    return this.raw.spaceId
  }

  get type(): string {
    return this.raw.type || ''
  }

  get element(): Element {
    return this.raw.element
  }

  get title(): string {
    return this.element?.children?.[0]?.text || ''
  }

  get isNormal() {
    return this.raw.status === NodeStatus.NORMAL
  }

  get isTrashed() {
    return this.raw.type === NodeType.TRASH
  }

  get isInbox() {
    return this.type === NodeType.INBOX
  }

  get isRootNode() {
    return this.type === NodeType.SPACE
  }

  get collapsed() {
    return this.raw.collapsed
  }

  get children() {
    return this.raw.children
  }

  get createdAt() {
    return this.raw.createdAt
  }

  get updatedAt() {
    return this.raw.updatedAt
  }

  get createdAtFormatted() {
    return format(this.raw.createdAt, 'yyyy-MM-dd HH:mm')
  }
  get updatedAtFormatted() {
    return format(this.raw.updatedAt, 'yyyy-MM-dd HH:mm')
  }
}
