import { Pagination } from '@/components/theme-ui/Pagination'
import { Post } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { PostItem } from './PostItem'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface PostListProps {
  posts: Post[]
  initialDisplayPosts?: Post[]
  pagination?: PaginationProps
}

export function PostList({
  posts,
  initialDisplayPosts = [],
  pagination,
}: PostListProps) {
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="">
      <div className="grid gap-2">
        {displayPosts.map((post, index) => {
          return <PostItem key={post.slug} post={post} />
        })}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  )
}
