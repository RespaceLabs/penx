'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { calculateSHA256FromFile } from '@/lib/encryption'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export const UploadAssetButton = ({ className, ...rest }: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }

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
    <Button variant="brand" {...rest} className={cn(className, 'p-0')}>
      <a
        onClick={handleClick}
        className="bg-transparent h-full w-full flex items-center gap-2 text-sm px-3"
      >
        {!uploading && <UploadCloud size={20} />}
        {!uploading && <div>Upload a image</div>}
        {uploading && (
          <div className="flex items-center gap-x-2">
            <div>Uploading...</div>
          </div>
        )}
      </a>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]!
          handleUpload(fileUploaded)
        }}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </Button>
  )
}
