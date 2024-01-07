import { fetchEventSource } from '@microsoft/fetch-event-source'
import { isSelfHosted } from '@penx/constants'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

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

    console.log(
      'spaceInfo.lastModifiedTime > localLastModifiedTime:',
      spaceInfo.lastModifiedTime > localLastUpdatedAt,
      spaceInfo.lastModifiedTime,
      localLastUpdatedAt,
    )

    if (spaceInfo.lastModifiedTime > localLastUpdatedAt) {
      await store.sync.pullFromCloud(space)
    }
  }
}

export async function runSSE() {
  const token = await trpc.user.sseToken.query()

  const url = isSelfHosted ? '/api/sse' : process.env.NEXT_PUBLIC_SSE_URL!

  console.log('sse___URL:', url)

  await fetchEventSource(url, {
    openWhenHidden: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    async onopen(response) {
      console.log('=========onopen', response)
    },
    onmessage(ev) {
      const spaceInfo: SpaceInfo = JSON.parse(ev.data)
      // console.log('===========spaceInfo:', spaceInfo)
      pull(spaceInfo)
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
