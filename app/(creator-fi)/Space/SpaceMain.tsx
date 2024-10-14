import { Space } from '../domains/Space'

interface Props {
  space: Space
}

export function SpaceMain({ space }: Props) {
  return (
    <div className="mt-10 min-h-[100vh] flex-1 pb-40 pr-8">
      <div className="mb-14 text-4xl font-semibold">{space.name}</div>
    </div>
  )
}
