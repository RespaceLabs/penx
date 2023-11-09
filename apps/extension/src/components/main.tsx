import { useEffect, useState } from 'react'

import { ACTIONS } from '~/common/action'
import type { MsgRes, TabInfo } from '~/common/types'

export function Main({ name = 'Extension' }) {
  const [tab, setTab] = useState<TabInfo>(null)

  const getCurrentTab = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    setTab(tab as TabInfo)
  }

  const onSendMsgToBg = async () => {
    try {
      if (tab) {
        const data = await chrome.runtime.sendMessage({
          type: ACTIONS.QueryTab,
          payload: tab,
        })

        console.log('popup.tsx onSendMsgToBg-res', data)
      } else {
        console.warn('popup.tsx No tab information')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const initTabsListener = () => {
    chrome.runtime.onMessage.addListener(
      (request: MsgRes<keyof typeof ACTIONS, any>, sender, sendResponse) => {
        console.log('%c=popup.tsx add Listener:', 'color:gold', request)
        if (request.type === ACTIONS.TabNotComplete) {
          // Todo
          console.log(
            '%c=popup.tsx-add Listener TabNotComplete:',
            'color: gold',
          )
        } else if (request.type === ACTIONS.GetPageContent) {
          console.log(
            '%c=popup.tsx-add Listener GetPageContent:',
            'color: gold',
          )
          // sendResponse({ staus: 'loading' })
          return Promise.resolve({ response: 'Hi from content script' })
        }

        return true
      },
    )
  }

  useEffect(() => {
    initTabsListener()
    getCurrentTab()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        width: '400px',
      }}>
      your currentUrl is: {tab?.url}
      <button onClick={onSendMsgToBg}>Send To Bg</button>
    </div>
  )
}
