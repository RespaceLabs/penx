import { useEffect, useState } from 'react'
import { appLoader } from './AppLoader'

export const useLoaderStatus = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    function handler() {
      setIsLoaded(true)
    }
    appLoader.emitter.on('loaded', handler)
    return () => {
      appLoader.emitter.off('loaded', handler)
    }
  }, [])

  return {
    isLoaded,
  }
}
