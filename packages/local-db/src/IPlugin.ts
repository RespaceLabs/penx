export interface IPlugin {
  id: string

  spaceId: string

  code: string

  manifest: {
    id: string
    name: string
    version: string
    description: string
    [key: string]: any
  }
}
