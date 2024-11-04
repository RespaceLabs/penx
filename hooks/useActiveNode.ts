import {
  activeNodeAtom,
  getDefaultActiveNode as getDefaultActiveNode,
} from '@/store'
import { useAtomValue } from 'jotai'

export function useActiveNode() {
  const activeNode = useAtomValue(activeNodeAtom)

  return {
    activeNode,
  }
}
