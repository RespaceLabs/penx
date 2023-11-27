import { atom } from 'jotai'
import { BaseStore, Session } from '../types'

export const sessionAtom = atom<Session>(null as any as Session)

export class SessionStore {
  constructor(private store: BaseStore) {}

  // get() {
  //   return this.store.get(sessionAtom)
  // }

  // set(session: Session) {
  //   this.store.set(sessionAtom, session)
  // }
}
