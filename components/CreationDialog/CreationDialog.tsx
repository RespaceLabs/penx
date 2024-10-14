'use client'

import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreatePost } from '@/hooks/useCreatePost'
import { PostType } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  CaseSensitive,
  Cat,
  Figma,
  ImageIcon,
  Link,
  Mic,
  Video,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCreationDialog } from './useCreationDialog'

interface Props {}

export function CreationDialog({}: Props) {
  const { isOpen, setIsOpen } = useCreationDialog()
  const { createPost, isPending } = useCreatePost()
  const [type, setType] = useState<PostType>('' as any)

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Create</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <Item
            isLoading={isPending && type == PostType.ARTICLE}
            onClick={async () => {
              setType(PostType.ARTICLE)
              await createPost(PostType.ARTICLE)
              setIsOpen(false)
            }}
          >
            <CaseSensitive></CaseSensitive>
            <div>Article</div>
          </Item>
          <Item
            isLoading={isPending && type == PostType.IMAGE}
            onClick={async () => {
              setType(PostType.IMAGE)
              await createPost(PostType.IMAGE)
              setIsOpen(false)
            }}
          >
            <ImageIcon />
            <div>Image</div>
          </Item>
          <Item disabled>
            <Video />
            <div>Video</div>
          </Item>
          <Item disabled>
            <Mic />
            <div>Audio</div>
          </Item>
          <Item disabled>
            <Figma />
            <div>Figma</div>
          </Item>
          <Item disabled>
            <Cat />
            <div>NFT</div>
          </Item>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ItemProps {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => Promise<void>
}

function Item({ children, isLoading, onClick, disabled }: ItemProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center h-20 hover:bg-accent rounded-xl cursor-pointer',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-none',
      )}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
    >
      {isLoading ? <LoadingDots /> : children}
    </div>
  )
}
