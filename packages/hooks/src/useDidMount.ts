import { useEffect, useRef } from 'react'

export function useDidMount(fn: (() => void) | (() => Promise<void>)) {
  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) return
    fn()
    mountedRef.current = true
  }, [fn])
}
