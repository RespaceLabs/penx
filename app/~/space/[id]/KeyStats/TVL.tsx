import { Creation } from '@/domains/Creation'

interface Props {
  creation: Creation
}
export function TVL({ creation }: Props) {
  return (
    <div>
      <div>${creation?.tvlFormatted}</div>
    </div>
  )
}
