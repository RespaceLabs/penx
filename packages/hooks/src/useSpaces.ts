import { useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Space } from '@penx/model'
import { spacesAtom } from '@penx/store'

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
    activeSpace: (activeSpace ? new Space(activeSpace) : null) as Space,
    spaces,
  }
}
