import { useEffect, useState } from 'react'
import { get } from 'idb-keyval'
import { useRouter } from 'next/router'
import { EditorApp } from '@penx/app'
import { PENX_SESSION_USER } from '@penx/constants'
import { SessionProvider } from '@penx/session'
import { RecoveryPhraseLoginProvider } from '~/components/RecoveryPhraseLogin/RecoveryPhraseLoginProvider'

export default function PageEditor() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { push } = useRouter()

  useEffect(() => {
    get(PENX_SESSION_USER).then((user) => {
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
        data: {
          userId: user?.id,
          address: user?.address,
          earlyAccessCode: user?.earlyAccessCode,
          publicKey: user?.publicKey,
          secret: user?.secret,
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
