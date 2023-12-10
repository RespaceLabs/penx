import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

import { db } from '@penx/local-db'
import type { ISpace } from '@penx/model-types'

const ACTIVE_SPACE_ID = 'ACTIVE_SPACE_ID'

const spacesAtom = atom<ISpace[]>([])
const loadingAtom = atom<boolean>(true)

const storage = new Storage()

export async function getActiveSpaceId() {
  const spaceId = await storage.get(ACTIVE_SPACE_ID)
  return spaceId
}

export const useInitLocalSpaces = () => {
  const { setSpaces, setActiveSpaceId, setLoading } = useLocalSpaces()
  async function loadSpaces() {
    const spaces = await db.listSpaces()
    setSpaces(spaces)

    const spaceId = await storage.get(ACTIVE_SPACE_ID)

    if (spaces.length && !spaceId) {
      const activeSpace = spaces.find((space) => space.isActive)
      await setActiveSpaceId(activeSpace?.id || spaces[0].id)
    }

    setLoading(false)
  }

  // on mounted
  useEffect(() => {
    loadSpaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useLocalSpaces() {
  const [spaces, setSpaces] = useAtom(spacesAtom)
  const [activeSpaceId, setActiveSpaceId] = useStorage<string>(ACTIVE_SPACE_ID)
  const [loading, setLoading] = useAtom(loadingAtom)

  return {
    spaces,
    setSpaces,
    activeSpaceId,
    setActiveSpaceId,
    loading,
    setLoading,
  }
}
