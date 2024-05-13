export interface Command {
  name: string
  title: string
  subtitle: string
  description: string
  code: string
}

export interface IExtension {
  id: string

  spaceId: string

  slug: string

  name: string

  version: string

  commands: Command[]

  description?: string

  author?: string

  createdAt: Date

  updatedAt: Date
}
