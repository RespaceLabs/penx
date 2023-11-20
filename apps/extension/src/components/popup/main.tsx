import { useEffect, useState } from 'react'

import { ACTIONS } from '~/common/action'
import type { MsgRes, TabInfo } from '~/common/types'

import styles from './main.module.css'

import './globals.css'

export function Main() {
  const [tab, setTab] = useState<TabInfo>(null)

  const getCurrentTab = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    setTab(tab as TabInfo)
  }

  const onClipEntirePage = async () => {
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

  const onEnterManually = async () => {
    window.close()
    await chrome.tabs.sendMessage(tab.id, {
      type: ACTIONS.EnterManually,
      payload: {},
    })
  }

  const onSubmit = () => {
    console.log('onsubmit')
  }

  useEffect(() => {
    initTabsListener()
    getCurrentTab()
  }, [])

  return (
    <div className={styles.container}>
      {/* your currentUrl is: {tab?.url} */}
      <ul className={styles.ul}>
        <li className={styles.item} onClick={onEnterManually}>
          Enter content manually
        </li>

        <li className={styles.item}>Clip selected content</li>

        <li className={styles.item} onClick={onClipEntirePage}>
          Clip entire page content
        </li>

        <li className={styles.item}>Screenshot</li>
      </ul>

      <div>
        <button className={styles.saveBtn} onClick={onSubmit}>
          Save to penx
        </button>
      </div>
    </div>
  )
}
