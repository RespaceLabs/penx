export interface Command {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string
  code: string
  isBuiltIn?: boolean
}

export interface IExtension {
  id: string

  spaceId: string

  slug: string

  name: string

  version: string

  commands: Command[]

  icon?: string

  description?: string

  author?: string

  createdAt: Date

  updatedAt: Date
}
