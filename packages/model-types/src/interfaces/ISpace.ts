export interface ISpace {
  id: string

  name: string

  description?: string

  sort: number

  color: string

  isActive: boolean

  isCloud: boolean

  activeNodeIds: string[]

  encrypted: boolean

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

  createdAt: Date

  updatedAt: Date
}
