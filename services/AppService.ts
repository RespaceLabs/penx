import { appLoading } from '@/hooks/useAppLoading'
import { channelsAtom } from '@/hooks/useChannels'
import { postAtom } from '@/hooks/usePost'
import { postsAtom } from '@/hooks/usePosts'
import { spaceIdAtom } from '@/hooks/useSpaceId'
import { spacesAtom } from '@/hooks/useSpaces'
import { SELECTED_SPACE } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { store } from '@/store'

export class AppService {
  constructor() {}

  init = async (postId = '') => {
    store.set(appLoading, true)
    const spaces = await api.space.mySpaces.query()
    store.set(spacesAtom, spaces)

    if (!spaces.length) {
      store.set(appLoading, false)
      return ''
    }

    let spaceId =
      store.get(spaceIdAtom) || (localStorage.getItem(SELECTED_SPACE) as string)

    const space = spaces.find((s) => s.id === spaceId)

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

    store.set(spaceIdAtom, spaceId)
    store.set(postsAtom, posts)
    store.set(channelsAtom, channels)
    store.set(appLoading, false)

    localStorage.setItem(SELECTED_SPACE, spaceId)
    if (!postId) {
      // return '/~'
    }
  }
}
