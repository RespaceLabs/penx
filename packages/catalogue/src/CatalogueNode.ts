import { convertToValidHtmlId } from './convertToValidHtmlId'
import { CatalogueNodeType, CreateCatalogueNodeOptions } from './types'

export class CatalogueNode {
  name: string

  id: string // docId or groupId

  isFolded: boolean

  emoji?: string

  url: string

  children?: CatalogueNode[]

  private _pathname: string = ''

  get pathname() {
    if (this._pathname) return this._pathname
    return convertToValidHtmlId(this.name).toLocaleLowerCase()
  }

  constructor(options: CreateCatalogueNodeOptions) {
    this.name = options.name
    this.id = options.id
    this.isFolded = options.isFolded ?? false
    this.url = options.url ?? ''
    this.emoji = options.emoji
    // this.children = options.children ?? []
  }

  setPathname(value: string) {
    this._pathname = value
  }

  toJSON() {
    return {
      name: this.name,
      id: this.id,
      isFolded: this.isFolded,
      emoji: this.emoji,
      url: this.url,
      pathname: this._pathname,
      children: this.children,
    }
  }
}
