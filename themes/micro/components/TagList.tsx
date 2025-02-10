'use client'

import { Tag } from '@/lib/theme.types'
import { slug } from 'github-slugger'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PostListWithTagProps {
  tags: Tag[]
}

export function TagList({ tags = [] }: PostListWithTagProps) {
  const pathname = usePathname()!

  return (
    <div className="">
      <ul className="flex flex-wrap gap-x-5">
        {tags.map((t) => {
          return (
            <li key={t.id} className="my-3">
              {decodeURI(pathname.split('/tags/')[1]) === slug(t.name) ? (
                <h3 className="inline py-2 text-brand-500">#{`${t.name}`}</h3>
              ) : (
                <Link
                  href={`/tags/${slug(t.name)}`}
                  className="py-2 text-foreground/60 hover:text-brand-500 dark:hover:text-brand-500 rounded-full"
                  aria-label={`View posts tagged ${t.name}`}
                >
                  #{`${t.name}`}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
