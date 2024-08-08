import { Creation } from '@/domains/Creation'
import { useKeyBalance } from '@/hooks/useKeyBalance'

interface Props {
  creation: Creation
}

export function KeyBalance({ creation }: Props) {
  return <Balance creation={creation} />
}

function Balance({ creation }: Props) {
  const { data, isLoading } = useKeyBalance(creation.id)

  if (isLoading) return null

  return (
    <div>
      <div>{data!.toString()}</div>
    </div>
  )
}
