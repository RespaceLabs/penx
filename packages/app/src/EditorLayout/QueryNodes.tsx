import { useQueryNodes } from '@penx/hooks'

interface Props {
  spaceId: string
}

export const QueryNodes = ({ spaceId }: Props) => {
  useQueryNodes(spaceId)
  return null
}
