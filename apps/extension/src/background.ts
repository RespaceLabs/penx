import { Storage } from '@plasmohq/storage'

import { db } from '@penx/local-db'
import { trpc } from '@penx/trpc-client'

import { BACKGROUND_EVENTS } from '~/common/action'
import {
  FAIL,
  spacesKey,
  SUCCESS,
  type MsgRes,
  type TabInfo,
} from '~/common/helper'
import { parsePreparedContent } from '~/common/parser'

const storage = new Storage()

async function setMessageToFrontEnd(
  type: keyof typeof BACKGROUND_EVENTS | string,
  payload: any,
) {
  try {
    const data = await chrome.runtime.sendMessage({
      type,
      payload,
    })

    console.log('bgjs-setMessageToFrontEnd', data)
    return data
  } catch (error) {
    console.log('bgjs-send msg error', error)
  }
}

/**
 * Newly install or refresh the plug-in
 * */
chrome.runtime.onInstalled.addListener(() => {
  console.log('bgjs-clipper-extension-init')
})

/**
 * Receive and process events from each page
 */
chrome.runtime.onMessage.addListener(
  async (
    message: MsgRes<keyof typeof BACKGROUND_EVENTS, any>,
    sender,
    sendResponse,
  ) => {
    if (!db.database.connection) {
      await db.database.connect()
    }

    console.log('%c=bgjs-onMessage.addListener-0:', 'color:red', message)
    switch (message.type) {
      case BACKGROUND_EVENTS.QueryTab: {
        saveCurrentPage(message.payload)
        break
      }
      case BACKGROUND_EVENTS.SCREEN_SHOT: {
        console.log(
          '%c=bgjs-onMessage.addListener-2:',
          'color:red',
          BACKGROUND_EVENTS.SCREEN_SHOT,
        )
        chrome.tabs.query({ lastFocusedWindow: true }, (res) => {
          chrome.tabs.captureVisibleTab(res[0].windowId as number, (url) => {
            console.log('%c=bgjs-onMessage.addListener-2-1::', 'color:red', url)
            sendResponse(url)
          })
        })
        break
      }
      case BACKGROUND_EVENTS.SUBMIT_CONTENT: {
        try {
          console.log('========request.payload:', message.payload)
          const spaceId = message.payload.spaceId
          const nodes = message.payload.nodes

          const space = await db.getSpace(spaceId)

          // console.log('=======space:', space, 'nodes:', nodes)

          await db.addNodesToToday(spaceId, nodes)

          await chrome.runtime.sendMessage({
            type: BACKGROUND_EVENTS.ADD_NODES_TO_TODAY,
            payload: {
              spaceId,
            },
          })

          // const res = await trpc.node.addNodesToToday.mutate({
          //   spaceId: request.payload.spaceId,
          //   nodes: JSON.stringify(request.payload.nodes),
          // })

          console.log('mySpaces-res', {
            data: message.payload.doc,
          })

          sendResponse({ msg: 'ok', code: SUCCESS })
        } catch (error) {
          console.log('add Nodes error:', error)
          sendResponse({ msg: error, code: FAIL })
        }
        break
      }
      case BACKGROUND_EVENTS.INT_POPUP: {
        try {
          const mySpaces = await trpc.space.mySpaces.query()
          if (mySpaces?.length) {
            storage.set(spacesKey, mySpaces)
          }
          sendResponse({ msg: 'ok', code: SUCCESS })
        } catch (error) {
          sendResponse({ msg: error, code: FAIL })
        }
        break
      }
    }

    return true
  },
)

async function saveCurrentPage(tabInfo: TabInfo) {
  if (tabInfo.status !== 'complete') {
    // show message to user on page yet to complete load
    setMessageToFrontEnd(BACKGROUND_EVENTS.TabNotComplete, {
      text: 'Page loading...',
    })
  } else if (tabInfo.status === 'complete') {
    await getPageContent(tabInfo)
  }
}

async function getPageContent(tabInfo: TabInfo) {
  try {
    const res = await chrome.tabs.sendMessage(tabInfo.id, {
      type: BACKGROUND_EVENTS.GetPageContent,
      payload: {},
    })

    console.log('%c=bgjs-savePage 1:', 'color:green', {
      url: tabInfo.url,
      document: res.document,
    })
    const document = await parsePreparedContent(tabInfo.url, res.document)
    console.log('%c=bgjs-savePage document-3:', 'color:green', {
      document,
      content: document?.content,
      res,
    })

    // TODO something
    // ...

    // TODO: test Send response to content and then parse markdownwn
    await chrome.tabs.sendMessage(tabInfo.id, {
      type: BACKGROUND_EVENTS.EndOfGetPageContent,
      payload: { ...document },
    })
  } catch (error) {
    console.log('set tabs msg err:', error)
  }
}
