import { Box } from '@fower/react'
import styles from 'data-text:./components/content/content.module.scss'
import type { PlasmoCSConfig } from 'plasmo'
import { useEffect } from 'react'
import { tinykeys } from 'tinykeys'
import TurndownService from 'turndown'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import type { MsgRes } from '~/common/helper'
import { prepareContent } from '~/common/prepare-content'

import { initFower } from './common/initFower'
import { ContentAppType } from './components/content/constants'
import { initContentApp } from './components/content/ContentApp'

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
            initContentApp({ type: request.payload.action as ContentAppType })
            break

          case ACTIONS.AreaSelect:
            initContentApp({ type: request.payload.action as ContentAppType })
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
        initContentApp({ type: ContentAppType.draggableEditor })
      },

      'Alt+Space': () => {
        console.log('open penx....')
        initContentApp({ type: ContentAppType.draggableEditor })
      },

      // Escape: () => {
      //   console.log('Open quick add....')
      //   initContentApp({ type: StartSelectEnum.draggableEditor })
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
  // return (
  //   <Box fixed top0 left0 bottom0 right0 square20 bgAmber200 zIndex-100>
  //     FOO
  //   </Box>
  // )
}

export default PlasmoOverlay
