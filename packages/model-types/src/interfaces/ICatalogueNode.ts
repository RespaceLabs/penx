export enum CatalogueNodeType {
  NODE = 'NODE',
  GROUP = 'GROUP',
}
export interface ICatalogueNode {
  id: string // nodeId

  folded: boolean

  type: CatalogueNodeType

  emoji?: string

  children?: ICatalogueNode[]
}
