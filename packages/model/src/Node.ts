import { format } from 'date-fns'
import { INode, NodeType } from '@penx/types'

type Element = {
  id: string
  type: string
  name?: string
  children: Array<{ text: string }>
}

export type WithFlattenedProps<T> = T & {
  parentId: string | null // parent node id
  depth: number
  index: number
}

export class Node {
  constructor(public raw: INode) {}

  get id(): string {
    return this.raw?.id || ''
  }

  parentId = this.raw?.parentId || ''

  get spaceId(): string {
    return this.raw.spaceId
  }

  get type(): string {
    return this.raw?.type || ''
  }

  get hasChildren() {
    return !!this.children.length
  }

  get props() {
    return this.raw.props || {}
  }

  get element(): Element {
    return this.raw.element
  }

  get title(): string {
    if (this.isDailyNote) {
      return format(new Date(this.raw.props.date || Date.now()), 'EEEE, LLL do')
    }

    if (this.isInbox) return 'Inbox'
    if (this.isTrash) return 'Trash'
    if (this.isDatabaseRoot) return 'Tags'

    return this.element?.children?.[0]?.text || this.props.name || ''
  }

  get isTrash() {
    return this.type === NodeType.TRASH
  }

  get isInbox() {
    return this.type === NodeType.INBOX
  }

  get isDailyNote() {
    return this.type === NodeType.DAILY_NOTE
  }

  get isRootNode() {
    return this.type === NodeType.ROOT
  }

  get isDatabaseRoot() {
    return this.type === NodeType.DATABASE_ROOT
  }

  get isDatabase() {
    return this.type === NodeType.DATABASE
  }

  get collapsed() {
    return this.raw.collapsed
  }

  get folded() {
    return this.raw.folded
  }

  get tagName() {
    return this.raw.props.name || ''
  }

  get tagColor() {
    return this.raw.props.color || ''
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

  get snapshotId() {
    if (this.isInbox) return NodeType.INBOX
    if (this.isRootNode) return NodeType.ROOT
    if (this.isTrash) return NodeType.TRASH
    return this.id
  }
}
