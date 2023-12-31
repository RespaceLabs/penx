import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import ky from 'ky'
import { useEffect } from 'react'

import type { Session, SessionContextValue } from '@penx/session'

const KEY = 'PENX_SESSION'

const sessionAtom = atomWithStorage<SessionContextValue>(KEY, {
  loading: true,
  data: null as any,
})

export function useSession() {
  const [value, setValue] = useAtom(sessionAtom)

  useEffect(() => {
    // const localSession = getLocalSession()

    // if (!value.data && !localSession?.data?.accessToken) {
    if (!value.data) {
      ky(`${process.env.PLASMO_PUBLIC_BASE_URL}/api/auth/session`)
        .json()
        .then((data) => {
          setValue({
            loading: false,
            data: Object.keys(data).length
              ? (data as Session)
              : (null as Session),
          })
        })
    }
  }, [value.data, setValue])
  return value
}
