'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Props {
  className?: string
}

export const PostTypeNav = ({ className }: Props) => {
  const param = useSearchParams()!
  const type = param.get('type')

  return (
    <div
      className={cn(
        'flex items-center text-sm gap-5 text-foreground/40',
        className,
      )}
    >
      <Link href="/" className={cn(!type && 'text-foreground')}>
        All
      </Link>
      <Link
        href="/?type=articles"
        className={cn(type === 'articles' && 'text-foreground')}
      >
        Articles
      </Link>
      <Link
        href="/?type=notes"
        className={cn(type === 'notes' && 'text-foreground')}
      >
        Notes
      </Link>
      <Link
        href="/?type=photos"
        className={cn(type === 'photos' && 'text-foreground')}
      >
        Photos
      </Link>
    </div>
  )
}
