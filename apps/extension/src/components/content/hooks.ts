import React, { useState } from 'react'
import { useStore } from 'stook'

import { selectedSpaceKey, storageDocKey } from '~/common/helper'

export function useDoc() {
  const [doc, setDoc] = useStore<string>(storageDocKey, '')
  return { doc, setDoc }
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
