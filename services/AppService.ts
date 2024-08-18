import { appLoading } from '@/hooks/useAppLoading'
import { channelsAtom } from '@/hooks/useChannels'
import { postAtom } from '@/hooks/usePost'
import { postsAtom } from '@/hooks/usePosts'
import { spaceAtom } from '@/hooks/useSpace'
import { spacesAtom } from '@/hooks/useSpaces'
import { api } from '@/lib/trpc'
import { store } from '@/store'
import { Space } from '@prisma/client'

interface Options {
  authenticated: boolean
  spaceId: string
  postId?: string
}
export class AppService {
  constructor() {}

  init = async (opt: Options) => {
    store.set(appLoading, true)

    let postId = opt.postId || ''
    let spaceId = opt.spaceId
    let space: Space | null = null

    if (spaceId) {
      space = await api.space.byId.query(opt.spaceId)
      store.set(spaceAtom, { space, isLoading: false })
    }

    if (!opt.authenticated) {
      store.set(appLoading, false)
      return
    }

    const spaces = await api.space.mySpaces.query()
    store.set(spacesAtom, spaces)

    if (!spaces.length) {
      store.set(appLoading, false)
      return ''
    }

    if (!space && spaces.length > 0) {
      spaceId = spaces[0].id
    }

    const [posts, channels] = await Promise.all([
      api.post.listBySpaceId.query(spaceId),
      api.channel.listBySpaceId.query(spaceId),
    ])

    if (!postId && posts.length > 1) {
      postId = posts[0].id
    }

    if (postId) {
      const post = await api.post.byId.query(postId)
      post && store.set(postAtom, post)
    }

    store.set(postsAtom, posts)
    store.set(channelsAtom, channels)
    store.set(appLoading, false)
  }
}
