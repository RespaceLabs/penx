import { useEffect, useState } from 'react'
import { db } from '@/lib/local-db'

export function useFile(fileId: string) {
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<any>(null as any)

  useEffect(() => {
    if (!fileId) return
    // db.getFile(fileId).then((file) => {
    //   setFile(new File(file))
    //   setLoading(false)
    // })
  }, [fileId])

  return {
    loading,
    file,
  }
}
