import { Post } from '@penxio/types'
import { Pagination } from './Pagination'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {displayPosts.map((post) => {
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
