import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { User } from '@penx/model'
import { store, userAtom } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export function useQueryUser(userId: string) {
  useEffect(() => {
    trpc.user.byId.query({ id: userId }).then((data) => {
      store.setUser(new User(data))
    })
  }, [userId])
}

export function useUser() {
  const user = useAtomValue(userAtom)
  return user
}
