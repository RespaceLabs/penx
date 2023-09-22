export type WithFlattenProps<T> = T & {
  parentId: string | null
  depth: number
  index: number
}

export enum CatalogueNodeType {
  DOC,
  GROUP,
  LINK,
}

export interface CreateCatalogueNodeOptions
  extends Omit<CatalogueNodeJSON, 'isFolded'> {
  isFolded?: boolean
}

export interface CatalogueNodeJSON {
  name: string

  id: string // docId or groupId

  isFolded: boolean

  type: CatalogueNodeType

  emoji?: string

  url?: string

  children?: CatalogueNodeJSON[]
}
