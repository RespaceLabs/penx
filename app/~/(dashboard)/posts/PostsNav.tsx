'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {}

export function PostsNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    published: '/~/posts',
    archived: '/~/posts/archived',
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center py-1.5 border-b-2 -mb-[1px] border-transparent',
      path === pathname && 'border-black border-zinc-400',
    )

  return (
    <div className="flex border-b gap-8">
      <Link href={Paths.published} className={linkClassName(Paths.published)}>
        Published
      </Link>

      <Link href={Paths.archived} className={linkClassName(Paths.archived)}>
        Archived
      </Link>
    </div>
  )
}
