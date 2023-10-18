import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { trpc } from '@penx/trpc-client'

export function useGitHubToken() {
  const { address = '' } = useAccount()
  const { data: token, ...rest } = useQuery(['githubToken'], () =>
    trpc.github.token.query({ address }),
  )

  const isTokenValid = useMemo(() => {
    if (!token) return false
    return !!token.ghToken
  }, [token])

  return {
    isTokenValid,
    token,
    ...rest,
  }
}
