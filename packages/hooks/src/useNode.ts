import { useAtomValue } from 'jotai'
import { Node } from '@penx/model'
import { nodeAtom } from '@penx/store'

export function useNode() {
  const node = useAtomValue(nodeAtom)

  return {
    node,
  }
}
