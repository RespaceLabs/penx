import { forwardRef, useRef, useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Post } from '@/hooks/usePost'
import { api } from '@/lib/trpc'
import { uploadFile } from '@/lib/uploadFile'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface Props {
  post: Post
}

export const ImageCreationUpload = forwardRef<HTMLDivElement, Props>(
  function ImageCreationUpload({ post }, ref) {
    const [value, setValue] = useState((post.content as string) || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        setLoading(true)
        const file = e.target.files[0]
        const src = URL.createObjectURL(file)
        setValue(src)

        try {
          const data = await uploadFile(file)
          await api.post.update.mutate({
            id: post.id,
            content: data.url,
          })
          setValue(data.url!)
        } catch (error) {
          console.log('Failed to upload file:', error)
        }

        setLoading(false)
      }
    }

    async function removeImage() {
      setValue('')
      await api.post.update.mutate({
        id: post.id,
        content: '',
      })
    }

    if (value) {
      return (
        <div className="w-full h-auto relative">
          <Image
            src={value || ''}
            width={80}
            height={80}
            className="absolute left-0 top-0 w-full h-auto cursor-pointer"
            alt=""
          />

          <X
            className="absolute top-1 right-1 bg-neutral-100 rounded-full p-1 text-neutral-800 w-8 h-8 cursor-pointer"
            onClick={removeImage}
          />
        </div>
      )
    }

    return (
      <div ref={ref}>
        <div className="w-full h-[560px] rounded-2xl bg-accent relative cursor-pointer flex items-center justify-center">
          <div className="absolute left-0 top-0 w-full h-full cursor-pointer z-1 flex items-center justify-center gap-1 text-neutral-400 text-sm">
            <ImageIcon size={18} />
            <div>Select image</div>
          </div>

          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
          {loading && <LoadingDots />}
        </div>
      </div>
    )
  },
)
