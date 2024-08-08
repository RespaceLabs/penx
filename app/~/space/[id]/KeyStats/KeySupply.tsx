import { Creation } from '@/domains/Creation'
import { useSupply } from '@/hooks/useSupply'
import { precision } from '@/lib/math'

interface Props {
  creation: Creation
}

export function KeySupply({ creation }: Props) {
  const { data, isLoading } = useSupply(creation.id)

  if (isLoading) return <div>-</div>

  return (
    <div>
      <div>{data!.toString()}</div>
    </div>
  )
}
