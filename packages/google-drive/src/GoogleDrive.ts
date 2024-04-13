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

  async getByFileId(fileId: string, fields = '') {
    let apiUrl = `https://www.googleapis.com/drive/v2/files/${fileId}?`

    if (fields) {
      apiUrl += `&fields=${fields}`
    }
    console.log('=====apiUrl:', apiUrl)

    const data = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then((response) => response.json())

    return data
  }

  async getSharableLink(fileId: string) {
    let apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`

    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    }).then((response) => response.json())

    return await this.getByFileId(fileId, 'webContentLink')
  }

  async createJSON(fileName: string, data: any, parentId?: string) {
    const form = new FormData()

    const file = new Blob([JSON.stringify(data)], { type: 'application/json' })

    const metadata: any = {
      name: fileName,
      mimeType: 'application/json',
    }

    if (parentId) metadata.parents = [parentId]

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

  async createFile(file: File, parentId?: string) {
    const formData = new FormData()

    const metadata: any = {
      name: file.name,
      // mimeType: 'image/png',
    }

    if (parentId) metadata.parents = [parentId]

    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
    )

    formData.append('file', file)

    const r = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
        },
        body: formData,
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

  async getOrCreateFolder(folderName: string) {
    let parentId = ''
    let folders = await this.listByName(folderName)

    if (!folders.length) {
      const folder = await this.createFolder(folderName)
      parentId = folder.id
    } else {
      parentId = folders[0].id
    }
    return parentId
  }

  async getFileByName(fileName: string) {
    const files = await this.listByName(fileName)

    if (files.length === 0) {
      throw new Error('File not found')
    }

    const fileId = files[0].id

    return this.getByFileId(fileId)
  }

  async getFileInFolder(folderId: string, fileName: string) {
    const q = encodeURIComponent(
      `'${folderId}' in parents and name='${fileName}' and trashed=false`,
    )

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

    return this.getByFileId(res.files[0].id)
  }
}
