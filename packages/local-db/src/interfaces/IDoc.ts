export interface IDoc {
  id: string

  spaceId: string

  title: string

  content: string

  parentId?: string

  emoji?: string

  isFolded?: boolean

  openedAt: number

  createdAt: number

  updatedAt: number
}
