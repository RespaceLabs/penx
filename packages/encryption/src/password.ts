import { get, set } from 'idb-keyval'

const ENCRYPTION_PASSWORD = 'ENCRYPTION_PASSWORD'

export async function getPassword() {
  return get(ENCRYPTION_PASSWORD)
}

export async function setPassword(password: string) {
  return set(ENCRYPTION_PASSWORD, password)
}
