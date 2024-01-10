export enum EditorMode {
  OUTLINER = 'OUTLINER',
  BLOCK = 'BLOCK',
}

export interface ISpace {
  id: string

  userId: string

  name: string

  description?: string

  editorMode: EditorMode

  sort: number

  color: string

  isActive: boolean

  activeNodeIds: string[]

  encrypted: boolean

  password: string

  // for cloud
  nodeSnapshot: {
    version: number
    nodeMap: Record<string, string>
  }

  // for github
  pageSnapshot: {
    version: number
    pageMap: Record<string, string>
  }

  /**
   * nodes last updated time
   */
  nodesLastUpdatedAt?: Date

  createdAt: Date

  updatedAt: Date
}
