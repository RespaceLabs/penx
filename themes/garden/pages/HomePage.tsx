import { Post, Site } from '@/lib/theme.types'
import { Lobster, Merienda } from 'next/font/google'
import { PostItem } from '../components/PostItem'

const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  site: Site
  posts: Post[]
}

export function HomePage({ posts = [], site }: Props) {
  const addresses = posts.reduce((acc, { user }) => {
    const { accounts = [] } = user
    for (const a of accounts) {
      if (a.providerType === 'WALLET') acc.push(a.providerAccountId)
    }
    return acc
  }, [] as string[])
  const receivers = Array.from(new Set(addresses))

  return (
    <div className="mx-auto sm:max-w-xl flex flex-col gap-10 mt-4">
      <div className="flex flex-col divide-y divide-foreground/5">
        {posts.map((post) => {
          return <PostItem key={post.slug} post={post} receivers={receivers} />
        })}
      </div>
    </div>
  )
}
