import { useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { CatalogueTree } from '@penx/catalogue'
import { db } from '@penx/local-db'
import { spacesAtom } from '@penx/store'

export function useQuerySpaces() {
  const setSpaces = useSetAtom(spacesAtom)

  useEffect(() => {
    db.listSpaces().then((spaces) => {
      setSpaces(spaces)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useSpaces() {
  const [spaces] = useAtom(spacesAtom)

  const activeSpace = useMemo(() => {
    const space = spaces.find((item) => item.isActive)
    return space || spaces[0]
  }, [spaces])

  const catalogueTree = useMemo(() => {
    ;(window as any).__space = activeSpace
    return CatalogueTree.fromJSON(activeSpace?.catalogue)
  }, [activeSpace])

  return {
    activeSpace,
    spaces,
    catalogueTree,
  }
}
