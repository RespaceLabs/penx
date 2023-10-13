import { useQueryDocs } from '@penx/hooks'

interface Props {
  spaceId: string
}

export const QueryDocs = ({ spaceId }: Props) => {
  useQueryDocs(spaceId)
  return null
}
