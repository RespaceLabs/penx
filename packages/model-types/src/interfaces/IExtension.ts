export interface Command {
  name: string
  title: string
  subtitle: string
  description: string
}

export interface IExtension {
  id: string

  spaceId: string

  code: string

  slug: string

  name: string

  version: string

  commands: Command[]

  description?: string

  author?: string

  createdAt: Date

  updatedAt: Date
}
