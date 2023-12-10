import styles from 'data-text:./components/content/content.module.scss'
import type { PlasmoCSConfig } from 'plasmo'
import { useEffect } from 'react'
import { tinykeys } from 'tinykeys'
import TurndownService from 'turndown'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import type { MsgRes } from '~/common/helper'
import { prepareContent } from '~/common/prepare-content'

import { initFower } from './common/initFower'
import { StartSelectEnum } from './components/content/helper'
import { initSelectArea } from './components/content/selector'

initFower()

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = styles

  return style
}

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
}

const PlasmoOverlay = () => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        request: MsgRes<keyof typeof BACKGROUND_EVENTS, any>,
        sender,
        sendResponse,
      ) => {
        console.log('%c=contentjs onMessage:', 'color:red', request)
        switch (request.type) {
          case BACKGROUND_EVENTS.GetPageContent:
            prepareContent()
              .then((document) => {
                sendResponse({ document })
              })
              .catch((error) => {
                console.log('prepare error', error)
              })
            break

          case BACKGROUND_EVENTS.EndOfGetPageContent:
            const turndownService = new TurndownService()
            const markdownContent = turndownService.turndown(
              request.payload.content,
            )

            console.log(
              '%c=contentjs onMessage EndOfGetPageContent parse markdownwn results:',
              'color:yellow',
              { markdownContent },
            )
            break

          case ACTIONS.EnterManually:
            initSelectArea({ type: request.payload.action as StartSelectEnum })
            break

          case ACTIONS.AreaSelect:
            initSelectArea({ type: request.payload.action as StartSelectEnum })
            break

          default:
            break
        }

        return true
      },
    )
  }, [])

  useEffect(() => {
    let unsubscribe = tinykeys(window, {
      'Shift+D': () => {
        console.log('open penx....')
        initSelectArea({ type: StartSelectEnum.draggableEditor })
      },

      'Shift+Space': () => {
        console.log('Open quick add....')
        initSelectArea({ type: StartSelectEnum.draggableEditor })
      },

      // Escape: () => {
      //   console.log('Open quick add....')
      //   initSelectArea({ type: StartSelectEnum.draggableEditor })
      // },
      // 'Meta+B': () => {
      //   console.log('META+B')
      // },
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return <></>
}

export default PlasmoOverlay
