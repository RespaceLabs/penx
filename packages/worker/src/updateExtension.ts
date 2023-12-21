import ky from 'ky'
import { Manifest } from '@penx/extension-typings'
import { db } from '@penx/local-db'

export async function updateExtension() {
  try {
    await ky('http://localhost:3000/extension').json()

    const eventSource = new EventSource('http://localhost:3000/extension-sse')

    eventSource.onmessage = async (event) => {
      const data = event.data
      const extension: Manifest = JSON.parse(data)
      console.log(
        '[Extension code updated, Please refresh page manually]:',
        extension,
      )

      const activeSpace = await db.getActiveSpace()
      if (activeSpace) {
        await db.installExtension({
          spaceId: activeSpace.id,
          code: extension.code,
          slug: extension.id,
          name: extension.name,
          description: extension.description!,
          version: extension.version,
        })
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
    }
  } catch (error) {
    console.log('error: ', error)
  }
}
