import { PropsWithChildren } from 'react'
import { useActiveNodes, useNodes, useQueryNodes } from '@penx/hooks'

interface Props {
  spaceId: string
}

export const WithNodes = ({ spaceId, children }: PropsWithChildren<Props>) => {
  useQueryNodes(spaceId)
  const { nodes } = useNodes()
  const { activeNodes } = useActiveNodes()
  if (!nodes.length || !activeNodes.length) return null
  return <>{children}</>
}
