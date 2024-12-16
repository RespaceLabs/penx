'use client'

import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreatePost } from '@/hooks/useCreatePost'
import { cn } from '@/lib/utils'
import { PostType } from '@prisma/client'
import {
  CaseSensitive,
  Cat,
  Figma,
  ImageIcon,
  Link,
  Mic,
  Video,
} from 'lucide-react'
import { useCreationDialog } from './useCreationDialog'

interface Props {}

export function CreationDialog({}: Props) {
  const { isOpen, setIsOpen } = useCreationDialog()
  const { createPost } = useCreatePost()
  const [isLoading, setLoading] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[425px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Create</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <Item
            isLoading={isLoading}
            onClick={async () => {
              setLoading(true)
              await createPost(PostType.ARTICLE)
              setTimeout(() => {
                setIsOpen(false)
                setLoading(false)
              }, 0)
            }}
          >
            <CaseSensitive></CaseSensitive>
            <div>Article</div>
          </Item>
          <Item
            disabled
            // isLoading={isPending && type == PostType.IMAGE}
            // onClick={async () => {
            //   setType(PostType.IMAGE)
            //   await createPost(PostType.IMAGE)
            //   setIsOpen(false)
            // }}
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
      {isLoading ? <LoadingDots className="bg-foreground/60" /> : children}
    </div>
  )
}
