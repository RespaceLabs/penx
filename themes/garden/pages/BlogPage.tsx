import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Post } from '@/lib/theme.types'
import { PostList } from '../components/PostList'

interface Props {
  posts: Post[]
  initialDisplayPosts: Post[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export function BlogPage({
  posts = [],
  pagination,
  initialDisplayPosts,
}: Props) {
  return (
    <div className="space-y-6 mx-auto sm:max-w-xl">
      <PageTitle>Blog</PageTitle>
      <PostList
        posts={posts}
        pagination={pagination}
        initialDisplayPosts={initialDisplayPosts}
      />
    </div>
  )
}
