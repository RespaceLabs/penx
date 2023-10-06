export interface IExtension {
  id: string

  spaceId: string

  code: string

  manifest: {
    id: string
    name: string
    version: string
    description?: string
    author?: string
    [key: string]: any
  }

  createdAt: number
  updatedAt: number
}
