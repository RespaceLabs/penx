import { EditorApp, initFower } from '@penx/app'
import { db } from '@penx/local-db'
import { SessionProvider } from '@penx/session'
import { store } from '@penx/store'

import { BACKGROUND_EVENTS } from './common/action'
import { TrpcProvider } from './components/TrpcProvider'
import { useSession } from './hooks/useSession'

import 'react-datepicker/dist/react-datepicker.css'
import './globals.css'

initFower()

chrome.runtime.onMessage.addListener(
  async function (message, sender, sendResponse) {
    if (!db.database.connection) {
      await db.database.connect()
    }

    if (message.type === BACKGROUND_EVENTS.ADD_NODES_TO_TODAY) {
      const activeSpace = await db.getActiveSpace()
      if (message.payload?.spaceId === activeSpace.id) {
        const nodes = await db.listNodesBySpaceId(activeSpace.id)
        const todayNode = await db.getTodayNode(activeSpace.id)
        store.node.setNodes(nodes)
        if (todayNode) {
          store.node.selectNode(todayNode)
        }
      }
    }
  },
)

async function init() {
  if (!db.database.connection) {
    await db.database.connect()
  }
}

init()

function IndexNewtab() {
  const session = useSession()

  return (
    <TrpcProvider token={''}>
      <SessionProvider value={session}>
        <EditorApp />
      </SessionProvider>
    </TrpcProvider>
  )
}

export default IndexNewtab
