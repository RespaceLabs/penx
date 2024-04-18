import { IColumnNode } from '@penx/model-types'

type ColumnSchema = Partial<IColumnNode['props']>

export interface createDatabaseOptions {
  spaceId: string

  name: string

  columnSchema?: ColumnSchema[]

  shouldInitCells?: boolean
}

export interface AddRowOptions {
  databaseId: string

  type?: 'common' | 'todo' | 'file'

  ref?: string // first column id

  sourceId?: string // todo source id

  fileHash?: string // file hash

  googleDriveFileId?: string // google drive file id
}

export interface CreateFileRowOptions {
  spaceId: string

  ref: string // first column id

  fileHash: string // file hash

  googleDriveFileId: string // google drive file id
}
