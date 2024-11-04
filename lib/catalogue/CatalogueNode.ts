import { CatalogueNodeType, ICatalogueNode } from '@/lib/model'
import { CreateCatalogueNodeOptions } from './types'

export class CatalogueNode {
  id: string // nodeId or groupId

  folded: boolean

  type: CatalogueNodeType

  emoji?: string

  children: CatalogueNode[] = []

  get isNode(): boolean {
    return this.type === CatalogueNodeType.NODE
  }

  get isGroup(): boolean {
    return this.type === CatalogueNodeType.GROUP
  }

  get foldable(): boolean {
    return !!this.children?.length
  }

  constructor(options: CreateCatalogueNodeOptions) {
    this.id = options.id
    this.type = options.type
    this.folded = options.folded ?? false
    this.emoji = options.emoji
  }

  toJSON() {
    return {
      id: this.id,
      folded: this.folded,
      emoji: this.emoji,
      type: this.type,
    }
  }
}
