// import { useSiteContext } from '@/components/SiteContext'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { store } from '@/lib/store'
import { PostType } from '@penxio/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { postAtom } from './usePost'
import { usePosts } from './usePosts'

export function useCreatePost() {
  // const { push } = useRouter()
  // const { refetch } = usePosts()
  // const { id } = useSiteContext()
  // const { isPending, mutateAsync } = trpc.post.create.useMutation()

  const createPost = async (type: PostType) => {
    //   try {
    //     const post = await mutateAsync({
    //       type,
    //       title: '',
    //       content: '',
    //     })
    //     store.set(postAtom, post as any)
    //     await refetch()
    //     // revalidateMetadata('posts')
    //     push(`/~/post/${post.id}`)
    //   } catch (error) {
    //     const msg = extractErrorMessage(error)
    //     toast.error(msg || 'Failed to create post')
    //   }
  }
  // return { isPending, createPost }
  return { isPending: false, createPost }
}
