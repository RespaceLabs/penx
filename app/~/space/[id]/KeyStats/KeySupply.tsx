import { Creation } from '@/domains/Creation'
import { useSupply } from '@/hooks/useSupply'

interface Props {
  creation: Creation
}

export function KeySupply({ creation }: Props) {
  const { data, isLoading } = useSupply(creation.id)

  if (isLoading || !data) return <div>-</div>

  return (
    <div>
      <div>{data!.toString()}</div>
    </div>
  )
}
