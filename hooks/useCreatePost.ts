import { PostType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { postAtom } from './usePost'
import { postsAtom, usePosts } from './usePosts'

export function useCreatePost() {
  const { push } = useRouter()
  const { refetch } = usePosts()
  const { isPending, mutateAsync } = trpc.post.create.useMutation()

  const createPost = async (type: PostType) => {
    try {
      const post = await mutateAsync({ type })
      store.set(postAtom, post as any)
      setTimeout(async () => {
        const posts = await api.post.list.query()
        store.set(postsAtom, posts)
      }, 0)
      await refetch()
      revalidateMetadata('posts')
      push(`/~/post/${post.id}`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create post')
    }
  }
  return { isPending, createPost }
}
