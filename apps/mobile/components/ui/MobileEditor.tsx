import { useEffect, useState } from 'react'
import { get } from 'idb-keyval'
// import { useRouter } from 'next/router'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/session'
import { getAuthorizedUser } from '@penx/storage'
import { RecoveryPhraseLoginProvider } from '@penx/widget'

export default function MobileEditor() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  // const { push } = useRouter()

  useEffect(() => {
    getAuthorizedUser().then((user) => {
      if (!user) {
        // TODO:
        // push('/')
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
        data: {
          userId: user?.id,
          address: user?.address,
          earlyAccessCode: user?.earlyAccessCode,
          publicKey: user?.publicKey,
          email: user?.email,
          user,
        },
        loading,
      }}
    >
      <RecoveryPhraseLoginProvider>
        <EditorApp />
      </RecoveryPhraseLoginProvider>
    </SessionProvider>
  )
}
