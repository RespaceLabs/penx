import mime from 'mime'

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

  async getFile(fileId: string) {
    let apiUrl = `https://www.googleapis.com/drive/v2/files/${fileId}?alt=media`

    const data = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const ext = mime.getExtension(blob.type)
        const file = new File([blob], `${fileId}.ext`, { type: blob.type })
        return file
      })

    return data
  }

  async getJSON(fileId: string, fields = '') {
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

    return await this.getJSON(fileId, 'webContentLink')
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

  async createFile(
    hash: string,
    file: File,
    parentId = '',
  ): Promise<DriveFile> {
    const ext = mime.getExtension(file.type)
    const fileName = `${hash}.${ext}`
    const files = await this.listFileInFolder(parentId, fileName)

    if (files.length) return files[0]

    const formData = new FormData()

    const metadata: any = {
      name: fileName,
    }

    if (parentId) metadata.parents = [parentId]

    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
    )

    formData.append('file', file)

    const driveFile = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
        },
        body: formData,
      },
    ).then((res) => res.json())

    console.log('r=======:', driveFile)
    return driveFile as DriveFile
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

    return this.getJSON(fileId)
  }

  async listFileInFolder(folderId: string, fileName: string) {
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

    return res.files || []
  }

  async getFileInFolder(folderId: string, fileName: string) {
    const files = await this.listFileInFolder(folderId, fileName)
    return this.getJSON(files[0].id)
  }
}
