'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { calculateSHA256FromFile } from '@/lib/encryption'
import { trpc } from '@/lib/trpc'
import { UploadButton } from './UploadButton'

export function AssetsNav() {
  const [uploading, setUploading] = useState(false)
  const { refetch } = trpc.asset.list.useQuery({
    pageSize: 10000,
  })
  async function handleUpload(file: File) {
    setUploading(true)
    const fileHash = await calculateSHA256FromFile(file)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('from', 'ASSET')

    const res = await fetch(`/asset/${fileHash}`, {
      method: 'PUT',
      headers: {
        // contentType: 'multipart/form-data',
      },
      body: formData,
    })

    if (res.ok) {
      const data = await res.json()
      toast.success('Image uploaded successfully!')
      await refetch()
    } else {
      toast.error('Upload image failed')
    }

    setUploading(false)
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div></div>
      <UploadButton
        uploading={uploading}
        handleFile={(file) => {
          handleUpload(file)
        }}
      />
    </div>
  )
}
