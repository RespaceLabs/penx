import { set } from 'idb-keyval'
import { MASTER_PASSWORD } from '@penx/constants'

export async function setPassword(value: string) {
  return set(MASTER_PASSWORD, value)
}
