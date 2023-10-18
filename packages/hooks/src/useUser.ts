import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { User } from '@penx/model'
import { trpc } from '@penx/trpc-client'

export function useUser() {
  const { address = '' } = useAccount()
  const { data, isLoading } = useQuery(['wallet_user'], () =>
    trpc.user.byAddress.query({ address }),
  )

  return { user: new User(data!), isLoading }
}
