import { atom } from 'jotai'
import { User } from '@penx/model'
import { StoreType } from '../store-types'

export const userAtom = atom<User>({} as User)

export const userLoadingAtom = atom<boolean>(false)

export const userIdAtom = atom('')

export const mnemonicAtom = atom('')

export class UserStore {
  constructor(private store: StoreType) {}

  getUserId() {
    return this.store.get(userIdAtom)
  }

  setUserId(userId: string) {
    return this.store.set(userIdAtom, userId)
  }

  getLoading(loading: boolean) {
    return this.store.get(userLoadingAtom)
  }

  setLoading(loading: boolean) {
    return this.store.set(userLoadingAtom, loading)
  }

  getUser() {
    return this.store.get(userAtom)
  }

  setUser(user: User) {
    return this.store.set(userAtom, user)
  }

  getMnemonic() {
    return this.store.get(mnemonicAtom)
  }

  setMnemonic(value: string) {
    return this.store.set(mnemonicAtom, value)
  }
}
