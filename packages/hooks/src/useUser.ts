import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { useAccount } from 'wagmi'
import { User } from '@penx/model'
import { store, userAtom } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export function useQueryUser() {
  const { address = '' } = useAccount()
  useEffect(() => {
    if (!address) return
    trpc.user.byAddress.query({ address }).then((data) => {
      store.setUser(new User(data))
    })
  }, [address])
}

export function useUser() {
  const user = useAtomValue(userAtom)
  return user
}
