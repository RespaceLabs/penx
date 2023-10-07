export enum ElementType {
  blockquote = 'blockquote',
}

export interface BlockquoteElement {
  id?: string
  type: ElementType.blockquote
  children?: any[]
}
