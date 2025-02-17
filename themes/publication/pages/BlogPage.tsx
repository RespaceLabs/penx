import { Post } from '@/lib/theme.types'
import { PageTitle } from '@/components/theme-ui/PageTitle'
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
    <div className="space-y-6 mx-auto max-w-2xl">
      <PageTitle className="text-center">Blog</PageTitle>
      <PostList
        posts={posts}
        pagination={pagination}
        initialDisplayPosts={initialDisplayPosts}
      />
    </div>
  )
}
