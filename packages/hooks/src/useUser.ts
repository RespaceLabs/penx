import { useEffect } from 'react'
import { set } from 'idb-keyval'
import { useAtomValue } from 'jotai'
import { PENX_SESSION_USER } from '@penx/constants'
import { User } from '@penx/model'
import { store, userAtom } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export function useQueryUser(userId: string) {
  useEffect(() => {
    trpc.user.byId.query({ id: userId }).then((data) => {
      store.setUser(new User(data))
      set(PENX_SESSION_USER, data)
    })
  }, [userId])
}

export function useUser() {
  const user = useAtomValue(userAtom)

  return user
}
