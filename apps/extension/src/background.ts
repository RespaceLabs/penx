import { BACKGROUND_EVENTS } from '~/common/action'
import { parsePreparedContent } from '~/common/parser'
import type { MsgRes, TabInfo } from '~/common/types'

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
  (
    request: MsgRes<keyof typeof BACKGROUND_EVENTS, any>,
    sender,
    sendResponse,
  ) => {
    ;(async () => {
      console.log('%c=bgjs-onMessage.addListener-0:', 'color:red', request)
      switch (request.type) {
        case BACKGROUND_EVENTS.QueryTab: {
          saveCurrentPage(request.payload)
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
              console.log(
                '%c=bgjs-onMessage.addListener-2-1::',
                'color:red',
                url,
              )
              sendResponse(url)
            })
          })
          break
        }
      }
    })()

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
      content: document.content,
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
