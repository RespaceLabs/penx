import { useEffect, useState } from 'react'
import { get } from 'idb-keyval'
import { EditorApp } from '@penx/app'
import { PENX_SESSION_USER } from '@penx/constants'
import { SessionProvider } from '@penx/session'

export default function PageEditor() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    get(PENX_SESSION_USER).then((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) return null

  return (
    <SessionProvider
      value={{
        data: { user, userId: user?.id },
        loading,
      }}
    >
      <EditorApp />
    </SessionProvider>
  )
}
