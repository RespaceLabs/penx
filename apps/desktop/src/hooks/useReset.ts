import { Dispatch, SetStateAction, useEffect } from 'react'
import { appEmitter } from '@penx/event'
import { useCommands, useDetail, useItems } from './useItems'

export function useReset(setQ: Dispatch<SetStateAction<string>>) {
  const { items, setItems } = useItems()
  const { commands } = useCommands()
  const { detail, setDetail } = useDetail()

  useEffect(() => {
    function reset() {
      setItems(commands)
      setQ('')
      setDetail('')
    }

    appEmitter.on('ON_MAIN_WINDOW_HIDE', reset)
    return () => {
      appEmitter.off('ON_MAIN_WINDOW_HIDE', reset)
    }
  }, [])
}
