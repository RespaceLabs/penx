import { appLoading } from '@/hooks/useAppLoading'
import { postAtom } from '@/hooks/usePost'
import { postsAtom } from '@/hooks/usePosts'
import { api } from '@/lib/trpc'
import { store } from '@/store'

interface Options {
  authenticated: boolean
  postId?: string
}
export class AppService {
  constructor() {}

  init = async (opt: Options) => {
    store.set(appLoading, true)

    let postId = opt.postId || ''

    if (!opt.authenticated) {
      store.set(appLoading, false)
      return
    }

    const [posts] = await Promise.all([api.post.list.query()])

    if (!postId && posts.length > 1) {
      postId = posts[0].id
    }

    if (postId) {
      const post = await api.post.byId.query(postId)
      post && store.set(postAtom, post)
    }

    store.set(postsAtom, posts)
    store.set(appLoading, false)
  }
}
