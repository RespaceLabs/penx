import { useQueryUser } from '@penx/hooks'

interface Props {
  userId: string
}

export const UserQuery = ({ userId }: Props) => {
  useQueryUser(userId)
  return null
}
