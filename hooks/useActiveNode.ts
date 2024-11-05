import {
  activeNodeAtom,
  getLocalActiveNode as getLocalActiveNode,
} from '@/store'
import { useAtomValue } from 'jotai'

export function useActiveNode() {
  const activeNode = useAtomValue(activeNodeAtom)

  return {
    activeNode,
  }
}
