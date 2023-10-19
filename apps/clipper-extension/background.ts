import { ACTIONS } from "~common/action"
import { parsePreparedContent } from "~common/parser"
import type { MsgRes, TabInfo } from "~common/types"

async function setMessageToFrontEnd(
  type: keyof typeof ACTIONS | string,
  payload: any
) {
  try {
    const data = await chrome.runtime.sendMessage({
      type,
      payload
    })

    console.log("bgjs-setMessageToFrontEnd", data)
    return data
  } catch (error) {
    console.log("bgjs-send msg error", error)
  }
}

/**
 * Newly install or refresh the plug-in
 * */
chrome.runtime.onInstalled.addListener(() => {
  console.log("bgjs-clipper-extension-init")
})

/**
 * Receive and process events from each page
 */
chrome.runtime.onMessage.addListener(
  (request: MsgRes<keyof typeof ACTIONS, any>, sender, sendResponse) => {
    ;(async () => {
      console.log("%c=bgjs-onMessage.addListener", "color:red", request)
      if (request.type === ACTIONS.QueryTab) {
        saveCurrentPage(request.payload)
      }
    })()

    return true
  }
)

async function saveCurrentPage(tabInfo: TabInfo) {
  if (tabInfo.status !== "complete") {
    // show message to user on page yet to complete load
    setMessageToFrontEnd(ACTIONS.TabNotComplete, {
      text: "Page loading..."
    })
  } else if (tabInfo.status === "complete") {
    await getPageContent(tabInfo)
  }
}

async function getPageContent(tabInfo: TabInfo) {
  try {
    const res = await chrome.tabs.sendMessage(tabInfo.id, {
      type: ACTIONS.GetPageContent,
      payload: {}
    })

    console.log("%c=bgjs-getPageContent:", "color:green", {
      url: tabInfo.url,
      document: res.document
    })
    const document = await parsePreparedContent(tabInfo.url, res.document)
    console.log("%c=bgjs-getPageContent document:", "color:green", {
      document,
      content: document.content,
      res
    })

    // TODO something
    // ...

    // TODO: Test send response to content and then parse markdownwn
    await chrome.tabs.sendMessage(tabInfo.id, {
      type: ACTIONS.EndOfGetPageContent,
      payload: { ...document }
    })
  } catch (error) {
    console.log("set tabs msg err:", error)
  }
}
