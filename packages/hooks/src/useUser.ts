import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { User } from '@penx/model'
import { setAuthorizedUser } from '@penx/storage'
import { store, userAtom, userLoadingAtom } from '@penx/store'
import { api } from '@penx/trpc-client'

export function useQueryUser(userId: string) {
  useEffect(() => {
    store.user.setLoading(true)

    api.user.me.query().then((data) => {
      store.user.setLoading(false)
      store.user.setUser(new User(data))
      setAuthorizedUser(data)
    })
  }, [userId])
}

export function useUser() {
  const user = useAtomValue(userAtom)

  return {
    user: user.raw ? user : (null as any as User),
  }
}

export function useUserLoading() {
  return useAtomValue(userLoadingAtom)
}
