import { useEffect, useState } from 'react'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import type { MsgRes, TabInfo } from '~/common/types'
import styles from '~/components/popup/main.module.css'

import '../components/popup/globals.module.css'

import { StartSelectEnum } from '~/components/content/helper'

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
          type: BACKGROUND_EVENTS.QueryTab,
          payload: tab,
        })

        console.log('popup.tsx onClipEntirePage-res', data)
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

        switch (request.type) {
          case BACKGROUND_EVENTS.TabNotComplete:
            // Todo
            console.log(
              '%c=popup.tsx-add Listener TabNotComplete:',
              'color: gold',
            )
            break
          case BACKGROUND_EVENTS.GetPageContent:
            console.log(
              '%c=popup.tsx-add Listener GetPageContent:',
              'color: gold',
            )
            // sendResponse({ staus: 'loading' })
            return Promise.resolve({ response: 'Hi from content script' })
          default:
            // Handle other cases here
            break
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

  const onAreaSelect = async (action: StartSelectEnum) => {
    window.close()
    await chrome.tabs.sendMessage(tab.id, {
      type: ACTIONS.AreaSelect,
      payload: {
        action,
      },
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

        <li
          className={styles.item}
          onClick={() => onAreaSelect(StartSelectEnum.areaSelect)}>
          Area select
        </li>

        <li
          className={styles.item}
          onClick={() => onAreaSelect(StartSelectEnum.screenShot)}>
          Screenshot c
        </li>

        <li className={styles.item} onClick={onClipEntirePage}>
          Clip ClipEntire Page
        </li>
      </ul>

      <div>
        <button className={styles.saveBtn} onClick={onSubmit}>
          Save to penx
        </button>
      </div>
    </div>
  )
}
