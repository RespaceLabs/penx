import { Post, postAtom } from '@/hooks/usePost'
import { postLoadingAtom } from '@/hooks/usePostLoading'
import { usePosts } from '@/hooks/usePosts'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { FileText } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface PostItemProps {
  post: Post
}
export function PostItem({ post }: PostItemProps) {
  const { push } = useRouter()
  const params = useParams()
  const isActive = params.id === post.id

  return (
    <div
      className={cn(
        'flex items-center gap-2 hover:bg-sidebar py-[6px] px-2 rounded cursor-pointer -mx-2',
        isActive && 'bg-sidebar',
      )}
      onClick={async () => {
        store.set(postLoadingAtom, true)
        try {
          const selectedPost = await api.post.byId.query(post.id)
          store.set(postAtom, selectedPost!)
        } catch (error) {}

        store.set(postLoadingAtom, false)

        push(`/~/post/${post.id}`)
      }}
    >
      <div className="inline-flex text-zinc-600">
        <FileText size={16} />
      </div>
      <div className="text-sm">{post.title || 'Untitled'}</div>
    </div>
  )
}

export function PostList() {
  const { posts } = usePosts()
  return (
    <div className="flex flex-col justify-center gap-[1px]">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}
