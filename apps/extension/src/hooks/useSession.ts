import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import ky from 'ky'
import { useEffect } from 'react'

interface Session {
  user: {
    name: string
    email: string
    image: string
    id: string
  }
  expires: string
  accessToken: string
  userId: string
}

type SessionData = {
  loading: boolean
  data: Session | null
}

const KEY = 'PENX_SESSION'

const sessionAtom = atomWithStorage<SessionData>(KEY, {
  loading: true,
  data: null,
})

const getLocalSession = () => {
  const localSession = localStorage.getItem(KEY)
  if (!localSession) return null
  try {
    const result = JSON.parse(localSession) as SessionData
    if (!result.data.accessToken) return null
    const expires = new Date(result.data.expires)
    if (expires.getTime() < new Date().getTime()) return null

    return result
  } catch (error) {
    return null
  }
}

export function useSession() {
  const [value, setValue] = useAtom(sessionAtom)

  useEffect(() => {
    // const localSession = getLocalSession()

    // if (!value.data && !localSession?.data?.accessToken) {
    if (!value.data) {
      ky(`${process.env.PLASMO_PUBLIC_API_BASE_URL}/api/auth/session`)
        .json()
        .then((data) => {
          setValue({
            loading: false,
            data: data as Session,
          })
        })
    }
  }, [value.data, setValue])
  return value
}
