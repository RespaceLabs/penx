import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { useAtomValue } from 'jotai'
import { PENX_SESSION_USER } from '@penx/constants'
import { User } from '@penx/model'
import { store, userAtom, userLoadingAtom } from '@penx/store'
import { api } from '@penx/trpc-client'

export function useQueryUser(userId: string) {
  useEffect(() => {
    store.user.setLoading(true)

    api.user.byId.query({ id: userId }).then((data) => {
      store.user.setLoading(false)
      store.user.setUser(new User(data))
      set(PENX_SESSION_USER, data)
    })
  }, [userId])
}

export function useUser() {
  const user = useAtomValue(userAtom)
  return user
}

export function useUserLoading() {
  return useAtomValue(userLoadingAtom)
}
