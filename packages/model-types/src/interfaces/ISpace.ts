import { SettingsType } from '@penx/constants'

export interface ISpace {
  id: string

  name: string

  description?: string

  sort: number

  color: string

  isActive: boolean

  isCloud: boolean

  activeNodeIds: string[]

  snapshot: {
    version: number
    nodeMap: Record<string, string>
  }

  createdAt: number

  updatedAt: number
}
