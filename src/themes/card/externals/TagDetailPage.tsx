import { Post, Tag } from '@penxio/types'
import { PostListWithTag } from '../components/PostListWithTag'

interface Props {
  posts: Post[]
  tags: Tag[]
}

export function TagDetailPage({ posts = [], tags = [] }: Props) {
  return <PostListWithTag posts={posts} tags={tags} />
}
