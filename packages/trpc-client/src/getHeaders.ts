import { get } from 'idb-keyval'

export async function getHeaders() {
  const token = await get('PENX_TOKEN')

  return {
    Authorization: !token ? '' : token,
  }
}
