import { useCallback, useEffect, useState } from 'react'
import { calculateSHA256FromFile } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { getAuthorizedUser } from '@penx/storage'

export function useGoogleDriveFile(googleDriveFileId: string) {
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState<string>('')

  const load = useCallback(async (googleDriveFileId: string) => {
    let rawFile: File
    const file = await db.file.where({ googleDriveFileId }).first()

    if (file?.value) {
      rawFile = file.value
    } else {
      const { google } = await getAuthorizedUser()
      const drive = new GoogleDrive(google.access_token)
      rawFile = await drive.getFile(googleDriveFileId)

      const fileHash = await calculateSHA256FromFile(rawFile)
      db.createFile({
        googleDriveFileId,
        fileHash,
        value: rawFile,
      })
    }

    const url = URL.createObjectURL(rawFile)

    setUrl(url)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!googleDriveFileId) return
    load(googleDriveFileId)
  }, [googleDriveFileId, load])

  return {
    loading,
    url,
  }
}
