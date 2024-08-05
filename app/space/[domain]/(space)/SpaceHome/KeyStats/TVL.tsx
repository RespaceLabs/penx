import { Creation } from '@/domains/Creation'
import { useCreation } from '@/hooks/useCreation'

interface Props {
  creation: Creation
}
export function TVL({ creation }: Props) {
  return (
    <div>
      <div>{creation?.tvlFormatted} ETH</div>
    </div>
  )
}
