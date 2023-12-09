import { Box } from '@fower/react'
import {
  Monitor,
  Scissors,
  Text,
  Volume2,
  type LucideProps,
} from 'lucide-react'
import { useEffect, useState, type ComponentType } from 'react'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import type { MsgRes, TabInfo } from '~/common/helper'
import { StartSelectEnum } from '~/components/content/helper'
import styles from '~/components/popup/popup.module.css'
import { SpacesSelect } from '~/components/popup/SpacesSelect'
import { UserProfile } from '~/components/popup/UserProfile'

interface FeatureEntryProps {
  name: string
  type: StartSelectEnum
  icon: ComponentType<LucideProps>
}

function FeatureEntry({ name, type, icon: Icon }: FeatureEntryProps) {
  const disabled = type !== StartSelectEnum.draggableEditor
  const onAreaSelect = async () => {
    if (disabled) return
    window.close()

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    await chrome.tabs.sendMessage(tab.id, {
      type: ACTIONS.AreaSelect,
      payload: {
        action: type,
      },
    })
  }
  return (
    <Box
      rounded2XL
      bgGray100
      p4
      column
      gap3
      cursorPointer
      bgGray200--hover={!disabled}
      cursorNotAllowed={disabled}
      opacity-60={disabled}
      onClick={onAreaSelect}>
      <Box textLG fontMedium>
        {name}
      </Box>
      <Box>
        <Icon size={20} />
      </Box>
    </Box>
  )
}

export function Popup() {
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

  const initPopup = async () => {
    await chrome.runtime.sendMessage({
      type: BACKGROUND_EVENTS.INT_POPUP,
      payload: {},
    })
  }

  useEffect(() => {
    initTabsListener()
    getCurrentTab()
    initPopup()
  }, [])

  return (
    <Box p4 h-280 w-300 column toBetween>
      <UserProfile />
      {/* your currentUrl is: {tab?.url} */}
      <Box grid gridTemplateColumns-2 gap2 mt4>
        <FeatureEntry
          name="Write"
          icon={Text}
          type={StartSelectEnum.draggableEditor}
        />
        <FeatureEntry
          name="Clip Page"
          icon={Scissors}
          type={StartSelectEnum.areaSelect}
        />
        <FeatureEntry
          name="Screen shot"
          icon={Monitor}
          type={StartSelectEnum.screenShot}
        />
        <FeatureEntry
          name="Voice"
          icon={Volume2}
          type={StartSelectEnum.screenShot}
        />
      </Box>

      {/* <SpacesSelect /> */}
    </Box>
  )
}
