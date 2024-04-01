type DriveFile = {
  kind: string
  id: string
  name: string
  mimeType: string
}

type FileRes = {
  kind: string
  incompleteSearch: boolean
  files: Array<DriveFile>
}

export class GoogleDrive {
  constructor(private accessToken: string) {}

  async getByFileId(fileId: string) {
    const apiUrl = `https://www.googleapis.com/drive/v2/files/${fileId}?alt=media`

    const data = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then((response) => response.json())

    return data
  }

  async createJSON(fileName: string, data: any, parentId?: string) {
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const metadata: any = {
      name: fileName,
      mimeType: 'application/json',
    }

    if (parentId) metadata.parents = [parentId]

    const form = new FormData()

    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
    )

    form.append('file', file)

    const r = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + this.accessToken },
        body: form,
      },
    ).then((res) => res.json())

    console.log('r=======:', r)
    return r
  }

  async createFolder(folderName: string) {
    const folderData = {
      mimeType: 'application/vnd.google-apps.folder',
      name: folderName,
    }

    const folder = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(folderData),
    }).then((response) => response.json())

    return folder as DriveFile
  }

  async updateJsonContent(fileId: string, data: any) {
    const endpoint = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const r = await fetch(endpoint, options).then((response) => response.json())
    console.log('r=======:', r)
  }

  async listByName(fileName: string) {
    const q = encodeURIComponent(`name='${fileName}' and trashed=false`)
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }

    const res: FileRes = await fetch(url, options).then((response) =>
      response.json(),
    )

    return res.files
  }

  async getFileByName(fileName: string) {
    const files = await this.listByName(fileName)

    if (files.length === 0) {
      throw new Error('File not found')
    }

    const fileId = files[0].id

    return this.getByFileId(fileId)
  }
}
