import { cn } from '@/lib/utils'
import { Post, Space } from '@/theme-helper/types'
import { format } from 'date-fns'
import Link from 'next/link'

const colors = [
  'bg-blue-500',
  'bg-sky-500',
  'bg-lime-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-fuchsia-500',
]

function isPost(post: any): post is Post {
  return typeof post !== 'string'
}

interface HomeProps {
  posts: Post[]
  space: Space
}

export function Home({ space, posts }: HomeProps) {
  const years = Array.from(
    new Set(posts.map((post) => format(new Date(post.createdAt), 'yyyy'))),
  )

  const list = years.reduce<(Post | string)[]>((acc, year) => {
    return [
      ...acc,
      year,
      ...posts.filter((p) => format(new Date(p.createdAt), 'yyyy') === year),
    ]
  }, [])

  return (
    <div className="grid w-ful gap-4">
      {!posts.length && <div className="text-neutral-500">No posts yet!</div>}

      {list.map((item) => {
        if (!isPost(item)) {
          return (
            <div className="relative pl-6 text-2xl mt-8 font-medium">
              <div
                className={cn(
                  'absolute w-2 h-2 rounded-full -left-[6px] top-[11px]',
                  colors[Number(item) % 12],
                )}
              ></div>
              <div>{item}</div>
            </div>
          )
        }
        return (
          <div key={item.id} className="flex gap-4 items-center pl-6 relative">
            <div className="absolute w-2 h-2 rounded-full bg-neutral-200 -left-[6px] top-[7px]"></div>
            <div className="font-light text-neutral-400 text-xs">
              {format(new Date(item.createdAt), 'MM-dd')}
            </div>

            <Link
              key={item.id}
              className="text-neutral-800 font-medium hover:scale-105 hover:text-neutral-950 transition-all"
              href={`/@${space.subdomain}/${item.slug}`}
            >
              {item.title}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
