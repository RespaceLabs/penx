'use client'

import { SELECTED_SPACE } from '@/lib/constants'
import { isServer } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'

export const spaceIdAtom = atom<string>(
  isServer ? '' : localStorage.getItem(SELECTED_SPACE) || '',
)

export function useSpaceId() {
  const [spaceId, setSpaceId] = useAtom(spaceIdAtom)
  return { spaceId, setSpaceId }
}
