import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@penx/hooks'
import { trpc } from '@penx/trpc-client'

export function useGitHubToken() {
  const { id } = useUser()

  const { data: github, ...rest } = useQuery(['githubToken'], () =>
    trpc.github.githubInfo.query({ userId: id }),
  )

  const isTokenValid = useMemo(() => {
    if (!github) return false
    return !!github.token
  }, [github])

  return {
    isTokenValid,
    github,
    token: github?.token,
    ...rest,
  }
}
