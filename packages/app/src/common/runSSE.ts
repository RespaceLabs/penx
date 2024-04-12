import { fetchEventSource } from '@microsoft/fetch-event-source'
import { isSelfHosted } from '@penx/constants'
import { db } from '@penx/local-db'
import { Space } from '@penx/model'
import { getAuthorizedUser } from '@penx/storage'
import { store } from '@penx/store'

type SpaceInfo = {
  spaceId: string
  userId: string
  lastModifiedTime: number
}

async function pull(spaceInfo: SpaceInfo) {
  if (!spaceInfo?.spaceId) return

  const space = await db.getSpace(spaceInfo.spaceId)
  if (space) {
    const localLastUpdatedAt = await db.getLastUpdatedAt(space.id)

    // console.log(
    //   'spaceInfo.lastModifiedTime > localLastModifiedTime:',
    //   spaceInfo.lastModifiedTime > localLastUpdatedAt,
    //   spaceInfo.lastModifiedTime,
    //   localLastUpdatedAt,
    // )

    if (spaceInfo.lastModifiedTime > localLastUpdatedAt) {
      await store.sync.pullFromCloud(space)
    }
  }
}

export async function runSSE() {
  const user = await getAuthorizedUser()

  if (!user?.syncServerUrl) return

  const url = isSelfHosted ? '/api/sse' : `${user.syncServerUrl}/sse`

  const controller = new AbortController()

  await fetchEventSource(url, {
    openWhenHidden: true,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: user.syncServerAccessToken }),
    signal: controller.signal,
    async onopen(response) {
      // console.log('=========onopen', response)
    },
    async onmessage(ev) {
      const spaceInfo: SpaceInfo = JSON.parse(ev.data)
      // console.log('===========spaceInfo:', spaceInfo)
      await pull(spaceInfo)
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      console.log('sse onclose=============')
    },
    onerror(err) {
      console.log('sse error=============:', err)
      // do nothing to automatically retry. You can also
      // return a specific retry interval here.
    },
  })
}
