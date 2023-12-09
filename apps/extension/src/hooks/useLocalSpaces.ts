import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

import { db } from '@penx/local-db'
import type { ISpace } from '@penx/model-types'

const spacesAtom = atom<ISpace[]>([])
const activeSpaceAtom = atom<ISpace>(null as any as ISpace)
const loadingAtom = atom<boolean>(true)

export function useLocalSpaces() {
  const [spaces, setSpaces] = useAtom(spacesAtom)
  const [activeSpace, setActiveSpace] = useAtom(activeSpaceAtom)
  const [loading, setLoading] = useAtom(loadingAtom)

  useEffect(() => {
    console.log('Loading....spaces')

    db.listSpaces().then((spaces) => {
      setSpaces(spaces)
      if (spaces.length && !activeSpace) {
        setActiveSpace(spaces.find((space) => space.isActive) || spaces[0])
      }
      setLoading(false)
    })
  }, [activeSpace, setSpaces, setLoading, setActiveSpace])

  return {
    spaces,
    activeSpace,
    setActiveSpace,
    loading,
  }
}
