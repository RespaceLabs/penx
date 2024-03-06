import { get } from 'idb-keyval'
import { MASTER_PASSWORD } from '@penx/constants'

export async function getPassword() {
  return get(MASTER_PASSWORD)
}
