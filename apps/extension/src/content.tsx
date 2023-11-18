import type { PlasmoCSConfig } from 'plasmo'
import { useEffect, useState } from 'react'
import TurndownService from 'turndown'

import { ACTIONS } from '~/common/action'
import { prepareContent } from '~/common/prepare-content'
import type { MsgRes } from '~/common/types'

import { DraggableBox } from './components/content/draggableBox'

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
}

const PlasmoOverlay = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (request: MsgRes<keyof typeof ACTIONS, any>, sender, sendResponse) => {
        console.log('%c=contentjs onMessage:', 'color:red', request)
        if (request.type === ACTIONS.GetPageContent) {
          prepareContent()
            .then((document) => {
              sendResponse({ document })
            })
            .catch((error) => {
              console.log('prepare error', error)
            })
        } else if (request.type === ACTIONS.EndOfGetPageContent) {
          const turndownService = new TurndownService()

          const markdownContent = turndownService.turndown(
            request.payload.content,
          )

          console.log(
            '%c=contentjs onMessage EndOfGetPageContent parse markdownwn results:',
            'color:yellow',
            { markdownContent },
          )
        }

        return true
      },
    )

    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
        setIsOpen(isOpen ? false : true)
      }
    }

    document.addEventListener('keydown', handleShortcut)

    return () => {
      document.removeEventListener('keydown', handleShortcut)
    }
  }, [])

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
