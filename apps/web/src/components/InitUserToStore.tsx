import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { User } from '@penx/model'
import { getAuthorizedUser, setAuthorizedUser } from '@penx/storage'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

interface Props {
  userId: string
}

export const InitUserToStore = ({ userId }: Props) => {
  const { data } = useQuery(['localUser', userId], async () => {
    let user = await getAuthorizedUser()

    if (user) {
      user = await api.user.me.query()
    }

    return user
  })

  useEffect(() => {
    if (data) {
      store.user.setUser(new User(data))
      setAuthorizedUser(data)
    }
  }, [data])

  return null
}
