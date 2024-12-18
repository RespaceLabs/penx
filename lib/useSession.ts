'use client'

import { useMemo } from 'react'
import { GoogleLoginData, LoginData, SessionData } from '@/lib/session'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from './queryClient'

const sessionApiRoute = '/api/session'

async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    ...init,
  }).then((res) => res.json())
}

export default function useSession() {
  const { isPending, data: session } = useQuery({
    queryKey: ['session'],
    queryFn: () => fetchJson<SessionData>(sessionApiRoute),
  })

  // const { trigger: login } = useSWRMutation(sessionApiRoute, doLogin, {
  //   // the login route already provides the updated information, no need to revalidate
  //   revalidate: false,
  // })

  // const { trigger: logout } = useSWRMutation(sessionApiRoute, doLogout)
  // const { trigger: increment } = useSWRMutation(sessionApiRoute, doIncrement)

  async function login(data: LoginData) {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      body: JSON.stringify(data),
      method: 'POST',
    })

    queryClient.setQueriesData({ queryKey: ['session'] }, res)
    return res
  }

  async function logout() {
    const res = await fetchJson<SessionData>(sessionApiRoute, {
      method: 'DELETE',
    })

    queryClient.setQueriesData({ queryKey: ['session'] }, res)
  }

  const status = useMemo(() => {
    if (isPending) return 'loading'
    if (!session?.isLoggedIn) return 'unauthenticated'
    if (session?.isLoggedIn) return 'authenticated'
    return 'loading'
  }, [isPending, session]) as 'loading' | 'unauthenticated' | 'authenticated'

  return {
    session: session?.isLoggedIn ? session : undefined,
    data: session?.isLoggedIn ? session : undefined,
    logout,
    login,
    status,
    isLoading: isPending,
    subscriptions: [] as any,
  }
}
