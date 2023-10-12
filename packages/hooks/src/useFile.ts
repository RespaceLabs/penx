import { useEffect, useState } from 'react'
import { File } from '@penx/domain'
import { db } from '@penx/local-db'

export function useFile(fileId: string) {
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File>(null as any)

  useEffect(() => {
    if (!fileId) return
    db.getFile(fileId).then((file) => {
      setFile(new File(file))
      setLoading(false)
    })
  }, [fileId])

  return {
    loading,
    file,
  }
}
