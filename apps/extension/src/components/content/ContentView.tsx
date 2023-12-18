import { Box } from '@fower/react'
import { useEffect, useState } from 'react'
import { tinykeys } from 'tinykeys'
import TurndownService from 'turndown'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import type { MsgRes } from '~/common/helper'
import { prepareContent } from '~/common/prepare-content'

import { ContentAppType } from './constants'
import { useContentApp } from './hooks/useAppType'
import { QuickAddEditor } from './QuickAddEditor/QuickAddEditor'
import { updateText, useText } from './stores/text.store'
import {
  getThumbnailState,
  hideThumbnail,
  showThumbnail,
  useThumbnail,
} from './stores/thumbnail.store'
import { Thumbnail } from './Thumbnail'

// import { ContentAppType } from './components/content/constants'

document.addEventListener('mouseup', async (event) => {
  const currentElement = event.target
  const targetElement = document.querySelector('.ai-translator-content')

  if (targetElement && targetElement.contains(currentElement as any)) {
    return
  }

  const selectedText = window.getSelection()?.toString() as string

  if (selectedText !== '') {
    const { pageX: x, pageY: y } = event
    // const { clientX: x, clientY: y } = event
    // console.log('====event:', event)
    const clientX = Math.min(event.clientX, window.innerWidth - event.clientX)
    const clientY = Math.min(event.clientY, window.innerHeight - event.clientY)

    setTimeout(() => {
      updateText(selectedText)
      showThumbnail(x, y, clientX, clientY)
    }, 10)
  }
})

document.addEventListener('click', (event) => {
  const currentElement = event.target
  const targetElement = document.querySelector('.penx-editor-content')

  if (targetElement && targetElement.contains(currentElement as any)) {
    return
  }
  const store = getThumbnailState()
  if (store?.visible) {
    hideThumbnail()
  }
})

export const ContentView = () => {
  const { x, y, clientX, clientY, visible } = useThumbnail()
  const { text } = useText()
  const { type, setType } = useContentApp()

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
            // TODO:
            break

          case ACTIONS.AreaSelect:
            setType(request.payload.action as ContentAppType)
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
      // 'Shift+D': () => {
      //   console.log('open penx....')
      //   setType(ContentAppType.draggableEditor)
      // },

      'Alt+Space': () => {
        console.log('open penx....')
        setType(ContentAppType.draggableEditor)
      },

      Escape: () => {
        hideThumbnail()
        setType('')
      },
    })
    return () => {
      unsubscribe()
    }
  }, [setType])

  //  <Box fixed top0 left0 bottom0 square-500 bgAmber200 zIndex-100>
  return (
    <Box absolute top0 left0>
      {/* {visible && text && !type && <Thumbnail x={x} y={y} />} */}
      {type === ContentAppType.draggableEditor && (
        <QuickAddEditor x={clientX} y={clientY} />
        // <QuickAddEditor />
      )}
    </Box>
  )
}
