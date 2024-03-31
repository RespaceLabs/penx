import ky from 'ky'
import { isProd, WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { EditorMode, INode } from '@penx/model-types'
import { getActiveSpaceId } from '@penx/storage'

const agentHost = 'http://127.0.0.1:31415'
const sseURL = `${agentHost}/agent-sse`
const addNodesSuccessfullyURL = `${agentHost}/add-nodes-successfully`

enum EventType {
  ADD_NODES = 'ADD_NODES',
}

type Event<T = any> = {
  eventType: EventType
  data: T
}

type AddTextEvent = {
  eventType: EventType.ADD_NODES
  data: string
}

async function isAgentAlive() {
  try {
    await ky.get(agentHost).json()
    return true
  } catch (error) {
    return false
  }
}

export async function runAgentSSE() {
  const isAlive = await isAgentAlive()
  if (!isAlive) return

  const eventSource = new EventSource(sseURL)
  // console.info('Listening on SEE', eventSource)
  eventSource.onmessage = async (ev) => {
    const event: Event = JSON.parse(ev.data)
    console.log('===event:', event)

    if (event.eventType === EventType.ADD_NODES) {
      const activeSpaceId = await getActiveSpaceId()
      const spaces = await db.listSpaces()

      const space = spaces.find((s) => s.id === activeSpaceId)

      if (!space) return

      const isOutliner = space?.editorMode === EditorMode.OUTLINER

      const newNodes = event.data.map((item: any) => {
        const node = JSON.parse(item.nodeData) as INode

        console.log('==========node:', node)

        return {
          ...node,
          spaceId: space.id,
          children: isOutliner ? node.children : [],
          parentId: isOutliner ? node.parentId : undefined,
          createdAt: new Date(node.createdAt),
          updatedAt: new Date(node.updatedAt),
        } as INode
      })

      console.log('=====newNodes:', newNodes)

      await db.addNodesToToday(space.id, newNodes)

      postMessage(WorkerEvents.ADD_TEXT_SUCCEEDED)

      await ky.get(addNodesSuccessfullyURL).json()
    }
  }
}

// export async function runKeeperSSE() {

//   await fetchEventSource(url, {
//     openWhenHidden: true,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({}),
//     async onopen(response) {
//       console.log('=========onopen', response)
//     },
//     onmessage(ev) {
//       const msg = JSON.parse(ev.data)
//       console.log('===========spaceInfo:', msg)
//     },
//     onclose() {
//       // if the server closes the connection unexpectedly, retry:
//       console.log('sse onclose=============')
//     },
//     onerror(err) {
//       console.log('sse error=============:', err)
//       // do nothing to automatically retry. You can also
//       // return a specific retry interval here.
//     },
//   })
// }
