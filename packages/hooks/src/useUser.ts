import { useAtomValue } from 'jotai'
import { User } from '@penx/model'
import { userAtom } from '@penx/store'

export function useUser() {
  const user = useAtomValue(userAtom)

  return {
    user: user.raw ? user : (null as any as User),
  }
}
