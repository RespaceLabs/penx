import { useEffect, useState } from 'react'
import { fowerStore } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'

interface Result {
  mode: string
  setMode: (mode: string) => void
}

export function useMode(): Result {
  const [state, setState] = useState<string>('')

  useEffect(() => {
    const mode = getCookie('theme-mode') as string

    setMode(mode || 'dark')
  }, [])

  function setMode(mode: string) {
    setState(mode)
    setCookie('theme-mode', mode)
    fowerStore.setMode(mode)
  }

  return { mode: state, setMode } as Result
}
