import { forwardRef, useRef, useState } from 'react'
import { ITitleElement } from '@/components/editor/plugins/title-plugin'
import LoadingDots from '@/components/icons/loading-dots'
import { uploadFile } from '@/lib/uploadFile'
import { cn, getUrl, isIPFSCID } from '@/lib/utils'
import { PlateElementProps } from '@udecode/plate-common/react'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

export function ImageObject({
  element,
  children,
}: PlateElementProps<ITitleElement>) {
  const [value, setValue] = useState(element?.props?.imageUrl || '')
  const editor = useSlate()
  const path = ReactEditor.findPath(editor as any, element)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('====e.target.files:', e.target.files)

    if (e.target.files?.length) {
      setLoading(true)
      const file = e.target.files[0]
      const src = URL.createObjectURL(file)
      setValue(src)

      try {
        const data = await uploadFile(file)

        const uri = data.url || data.cid || ''

        Transforms.setNodes(
          editor,
          {
            props: { ...element?.props, imageUrl: uri },
          } as ITitleElement,
          { at: path },
        )

        setValue(
          isIPFSCID(uri)
            ? `https://ipfs-gateway.spaceprotocol.xyz/ipfs/${uri}`
            : uri,
        )
      } catch (error) {
        console.log('Failed to upload file:', error)
      }

      setLoading(false)
    }
  }

  async function removeImage() {
    setValue('')

    Transforms.setNodes(
      editor,
      {
        props: { ...element?.props, imageUrl: '' },
      } as ITitleElement,
      { at: path },
    )
  }

  if (value) {
    return (
      <div className="w-full h-[360px] relative mt-8" contentEditable={false}>
        <Image
          src={getUrl(value)}
          width={1000}
          height={1000}
          className="absolute left-0 top-0 w-full h-[360px] cursor-pointer object-cover z-1"
          alt=""
        />

        <X
          className="absolute top-1 right-1 bg-background rounded-full p-1 text-foreground/80 w-8 h-8 cursor-pointer z-10"
          onClick={removeImage}
        />
      </div>
    )
  }

  return (
    <div
      className="relative rounded-xl bg-foreground/5 overflow-hidden active:bg-foreground/10 p-5 h-96 flex items-center justify-center mt-8"
      contentEditable={false}
    >
      <div className="text-foreground/50 bg-transparent flex items-center gap-2 text-sm hover:text-brand-500">
        <ImageIcon size={16} className="-ml-3" />
        <div>Upload a image</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer z-10"
      />
      {loading && <LoadingDots />}
    </div>
  )
}
