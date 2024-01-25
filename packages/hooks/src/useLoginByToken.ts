import { set } from 'idb-keyval'
import { toast } from 'uikit'
import { PENX_SESSION_USER } from '@penx/constants'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

export function useLoginByToken() {
  // const { setToken } = useToken()
  async function login(token: string) {
    console.log('token===:', token)

    if (!token) {
      toast.warning('Please input your personal token')
      throw new Error('')
    }

    try {
      const payload = await api.user.loginByPersonalToken.mutate(token)

      console.log('========payload:', payload)
      store.setToken(payload.token)
      set(PENX_SESSION_USER, payload.user)
    } catch (error) {
      toast.warning('Please input a valid token')
      throw new Error('')
    }

    // setToken(payload.token)
    // setUser(payload.user)
    // push('/editor')
  }
  return { login }
}
