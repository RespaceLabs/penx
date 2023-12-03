import { useStorage } from '@plasmohq/storage/hook'
import React, { useState } from 'react'
import { useStore } from 'stook'

import { selectedSpaceKey, spacesKey, storageDocKey } from '~/common/helper'

export function useDoc() {
  const [doc, setDoc] = useStore<string>(storageDocKey, '')
  return { doc, setDoc }
}

export function useStorageDoc() {
  const [storageDoc, setStorageDoc] = useStorage<string>(storageDocKey, '')
  return { storageDoc, setStorageDoc }
}

export function useSelectedSpace() {
  const [selectedSpace, setSelectedSpace] = useStorage(selectedSpaceKey, '')
  return { selectedSpace, setSelectedSpace }
}

export function useMySpaces() {
  const [mySpaces, setMySpaces] = useStorage(spacesKey, [])
  return { mySpaces, setMySpaces }
}

export function useForceUpdate() {
  const [_, setCount] = useState(0)

  const forceUpdate = () => {
    setCount((count) => count + 1)
  }

  return {
    forceUpdate,
  }
}
