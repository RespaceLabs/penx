'use client'

import { usePostSaving } from '@/hooks/usePostSaving'
import { PublishPopover } from '../PublishPopover'

interface PostHeaderProps {}
export function PostHeader({}: PostHeaderProps) {
  const { isPostSaving } = usePostSaving()

  return (
    <div className="flex h-14 items-center space-x-3 justify-between px-2">
      <div></div>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-stone-400  dark:text-stone-500">
          {isPostSaving ? 'Saving...' : 'Saved'}
        </div>
        <PublishPopover />
      </div>
    </div>
  )
}
