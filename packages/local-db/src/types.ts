export interface AddRowOptions {
  databaseId: string

  type?: 'common' | 'todo' | 'file'

  ref?: string // first column id

  sourceId?: string // todo source id

  hash?: string // file hash

  googleDriveFileId?: string // google drive file id
}

export interface CreateFileRowOptions {
  spaceId: string

  ref: string // first column id

  hash: string // file hash

  googleDriveFileId: string // google drive file id
}
