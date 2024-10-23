'use client'

import { Dispatch, SetStateAction } from 'react'
import { Post, usePost } from '@/hooks/usePost'
import { usePostSaving } from '@/hooks/usePostSaving'
import { PostStatus } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { PublishPopover } from './PublishPopover'

interface PostHeaderProps {}
export function PostHeader({}: PostHeaderProps) {
  const { isPostSaving } = usePostSaving()

  return (
    <div className="flex items-center space-x-3 justify-between fixed right-0 left-0 top-1 h-12 px-2">
      <Link
        href="/~/posts"
        className="inline-flex w-8 h-8 text-foreground items-center justify-center bg-accent rounded-xl cursor-pointer"
      >
        <ChevronLeft size={20} />
      </Link>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-stone-400  dark:text-stone-500">
          {isPostSaving ? 'Saving...' : 'Saved'}
        </div>
        <PublishPopover />
      </div>
    </div>
  )
}
