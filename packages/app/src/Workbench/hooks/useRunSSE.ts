import { useEffect, useRef } from 'react'
import { isSyncEnabled } from '@penx/constants'
import { useActiveSpace } from '@penx/hooks'
import { useSession } from '@penx/session'
import { runSSE } from '../../common/runSSE'

export function useRunSSE() {
  const { data: session } = useSession()
  const { activeSpace } = useActiveSpace()

  const sseInited = useRef(false)

  useEffect(() => {
    if (!navigator.onLine) return

    if (!isSyncEnabled) return

    if (!sseInited.current && session?.user && activeSpace.raw) {
      setTimeout(() => {
        console.log('runSSE..............')
        runSSE()

        sseInited.current = true
      }, 4000)
    }
  }, [session, activeSpace])
}
