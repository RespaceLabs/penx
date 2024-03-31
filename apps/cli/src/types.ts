export type Env = 'local' | 'dev' | 'prod'

export type User = any // TODO: handle user type

export type Space = {
  id: string
  name: string
  description: string
  editorMode: string
  sort: number
  color: string
  activeNodeIds: any[]
  pageSnapshot: any
  createdAt: string
  updatedAt: string
  userId: string
  syncServerId: string
  syncServerAccessToken: string
  syncServerUrl: string
}

export interface Config {
  env: Env
  token: string
  user: User
  space: Space
}
