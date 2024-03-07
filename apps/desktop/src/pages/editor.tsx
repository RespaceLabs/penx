import { useEffect, useState } from 'react'
import { get } from 'idb-keyval'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { EditorApp } from '@penx/app'
import { PENX_SESSION_USER } from '@penx/constants'
import { SessionProvider } from '@penx/session'
import { MasterPasswordProvider } from '~/components/MasterPasswordLogin/MasterPasswordProvider'

export default function PageEditor() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { push } = useRouter()

  useEffect(() => {
    get(PENX_SESSION_USER).then((user) => {
      console.log('======user:', user)
      if (!user) {
        push('/')
        // setLoading(false)
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [])

  if (loading) return null

  return (
    <SessionProvider
      value={{
        data: { user, userId: user?.id, address: user.address },
        loading,
      }}
    >
      <MasterPasswordProvider>
        <EditorApp />
      </MasterPasswordProvider>
    </SessionProvider>
  )
}
