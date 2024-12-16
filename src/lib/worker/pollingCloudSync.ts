import { getLocalSession } from '../local-session'
import { sync } from '../sync'
import { sleep } from '../utils'

export async function pollingCloudSync() {
  let pollingInterval = 10 * 1000

  // console.log('=======pollingInterval:', pollingInterval)

  while (true) {
    try {
      const session = await getLocalSession()
      if (session?.userId && session?.role === 'ADMIN') {
        await sync(true)
      }
    } catch (error) {
      console.log('error=========:', error)
    }

    await sleep(pollingInterval)
  }
}
