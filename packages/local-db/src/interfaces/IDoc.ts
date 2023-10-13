export enum DocStatus {
  NORMAL,
  DELETED,
}

export interface IDoc {
  id: string

  spaceId: string

  title: string

  content: string

  parentId?: string

  emoji?: string

  openedAt: number

  status: DocStatus

  createdAt: number

  updatedAt: number
}
