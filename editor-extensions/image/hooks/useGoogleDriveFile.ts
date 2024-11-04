import { useCallback, useEffect, useState } from 'react'
import { calculateSHA256FromFile } from '@/lib/encryption'
import { GoogleDrive } from '@/lib/google-drive'
import { db } from '@/lib/local-db'

export function useGoogleDriveFile(googleDriveFileId: string) {
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState<string>('')

  const load = useCallback(async (googleDriveFileId: string) => {}, [])

  useEffect(() => {
    if (!googleDriveFileId) return
    load(googleDriveFileId)
  }, [googleDriveFileId, load])

  return {
    loading,
    url,
  }
}
