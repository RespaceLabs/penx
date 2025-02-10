'use client'

import { ChevronLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePage } from '@/lib/hooks/usePage'
import { PageStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useSiteContext } from '../SiteContext'
import { Badge } from '../ui/badge'
import { PublishPagePopover } from './PublishPagePopover'

interface PostHeaderProps {
  className?: string
}
export function PageNav({ className }: PostHeaderProps) {
  const { page } = usePage()
  const host = location.host

  return (
    <div
      className={cn(
        'flex items-center space-x-3 justify-between fixed md:sticky right-0 left-0 bottom-0 md:top-0 h-12 px-2 bg-background z-20',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <Link
          href="/~/pages"
          className="inline-flex w-8 h-8 text-foreground items-center justify-center bg-accent rounded-xl cursor-pointer"
        >
          <ChevronLeft size={20} />
        </Link>
        {page?.status === PageStatus.PUBLISHED && (
          <div className="flex items-center gap-1">
            <Badge size="sm" className="text-xs">
              Published
            </Badge>
            <a
              href={`${location.protocol}//${host}/p/${page.slug}`}
              target="_blank"
              className="text-foreground/40 hover:text-foreground/80 flex items-center gap-1 text-sm"
            >
              <span>{`/p/${page.slug}`}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <PublishPagePopover className="" />
      </div>
    </div>
  )
}
