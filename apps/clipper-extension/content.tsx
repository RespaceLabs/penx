import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import TurndownService from "turndown"

import { ACTIONS } from "~common/action"
import type { MsgRes } from "~common/types"
import { prepareContent } from "~content/prepare-content"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const PlasmoOverlay = () => {
  useEffect(() => {
    console.log("===contentjs-content.tsx-init====")

    chrome.runtime.onMessage.addListener(
      (request: MsgRes<keyof typeof ACTIONS, any>, sender, sendResponse) => {
        console.log("%c=contentjs onMessage:", "color:red", request)
        if (request.type === ACTIONS.GetPageContent) {
          prepareContent()
            .then((document) => {
              sendResponse({ document })
            })
            .catch((error) => {
              console.log("prepare error", error)
            })
        } else if (request.type === ACTIONS.EndOfGetPageContent) {
          const turndownService = new TurndownService()

          const markdownContent = turndownService.turndown(
            request.payload.content
          )

          console.log(
            "%c=contentjs onMessage EndOfGetPageContent parse markdownwn results:",
            "color:yellow",
            { markdownContent }
          )
        }

        return true
      }
    )
  }, [])

  return <div />
}

export default PlasmoOverlay
