'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePostSaving } from '@/lib/hooks/usePostSaving'
import { cn } from '@/lib/utils'
import { PublishPopover } from '../PublishPopover'

interface PostHeaderProps {
  className?: string
}
export function PostNav({ className }: PostHeaderProps) {
  const { isPostSaving } = usePostSaving()

  return (
    <div
      className={cn(
        'flex items-center space-x-3 justify-between fixed md:sticky right-0 left-0 bottom-0 md:top-0 h-12 px-2 bg-background z-20',
        className,
      )}
    >
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
