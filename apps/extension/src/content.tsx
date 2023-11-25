import styles from 'data-text:./components/content/content.module.css'
import type { PlasmoCSConfig } from 'plasmo'
import { useEffect, useState } from 'react'
import TurndownService from 'turndown'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import { prepareContent } from '~/common/prepare-content'
import type { MsgRes } from '~/common/types'

import { DraggableBox } from './components/content/draggableBox'
import { StartSelectEnum } from './components/content/helper'
import { initSelectArea } from './components/content/selector'

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = styles

  return style
}

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
}

const PlasmoOverlay = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (
        request: MsgRes<keyof typeof BACKGROUND_EVENTS, any>,
        sender,
        sendResponse,
      ) => {
        console.log('%c=contentjs onMessage:', 'color:red', request)
        if (request.type === BACKGROUND_EVENTS.GetPageContent) {
          prepareContent()
            .then((document) => {
              sendResponse({ document })
            })
            .catch((error) => {
              console.log('prepare error', error)
            })
        } else if (request.type === BACKGROUND_EVENTS.EndOfGetPageContent) {
          const turndownService = new TurndownService()

          const markdownContent = turndownService.turndown(
            request.payload.content,
          )

          console.log(
            '%c=contentjs onMessage EndOfGetPageContent parse markdownwn results:',
            'color:yellow',
            { markdownContent },
          )
        } else if (request.type === ACTIONS.EnterManually) {
          setIsOpen(true)
        } else if (request.type === ACTIONS.AreaSelect) {
          initSelectArea({ type: request.payload.action as StartSelectEnum })
        }

        return true
      },
    )
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener('keydown', handleShortcut)

    return () => {
      document.removeEventListener('keydown', handleShortcut)
    }
  }, [isOpen])

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <DraggableBox isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default PlasmoOverlay
