import React, { useState } from 'react'
import { useStore } from 'stook'

import { storageDocKey } from '~/common/types'

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
