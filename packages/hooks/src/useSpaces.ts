import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { spacesAtom } from '@penx/store'

export function useQuerySpaces() {
  const setSpaces = useSetAtom(spacesAtom)

  useEffect(() => {
    db.listSpaces().then((spaces) => {
      setSpaces(spaces)
    })
  }, [setSpaces])
}

export function useSpaces() {
  const spaces = useAtomValue(spacesAtom)

  const activeSpace = useMemo(() => {
    const space = spaces.find((item) => item.isActive)
    return space || spaces[0]
  }, [spaces])

  useEffect(() => {
    ;(window as any).__space = activeSpace
  }, [activeSpace])

  return {
    activeSpace,
    spaces,
  }
}
