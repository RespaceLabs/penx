'use client'

import { useSpace } from '../hooks/useSpace'
import { SpaceTradeList } from '../Space/SpaceTradeList'

export default function Page() {
  const { space } = useSpace()
  if (!space) return
  return <SpaceTradeList space={space} />
}
