import { useEffect, useRef } from 'react'
import { useSpaces } from '@penx/hooks'
import { useSession } from '@penx/session'
import { runSSE } from '../../common/runSSE'

export function useRunSSE() {
  const { data: session } = useSession()
  const { activeSpace } = useSpaces()

  const sseInited = useRef(false)

  useEffect(() => {
    if (!navigator.onLine) return
    if (!sseInited.current && session?.user) {
      // console.log('runSSE..............')
      runSSE(activeSpace)
      sseInited.current = true
    }
  }, [session, activeSpace])
}
