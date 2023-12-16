import { Box } from '@fower/react'
import {
  Monitor,
  Scissors,
  Text,
  Volume2,
  type LucideProps,
} from 'lucide-react'
import { useEffect, useState, type ComponentType } from 'react'
import { Button } from 'uikit'

import { Logo } from '@penx/app'

import { ACTIONS, BACKGROUND_EVENTS } from '~/common/action'
import type { MsgRes, TabInfo } from '~/common/helper'
import { ContentAppType } from '~/components/content/constants'
import styles from '~/components/popup/popup.module.css'
import { SpacesSelect } from '~/components/popup/SpacesSelect'
import { UserProfile } from '~/components/popup/UserProfile'

import { LocalSpacesSelect } from './LocalSpacesSelect'

interface FeatureEntryProps {
  name: string
  type: ContentAppType
  icon: ComponentType<LucideProps>
}

function FeatureEntry({ name, type, icon: Icon }: FeatureEntryProps) {
  const disabled = type !== ContentAppType.draggableEditor
  const onAreaSelect = async () => {
    if (disabled) return
    window.close()

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    chrome.tabs.sendMessage(tab.id!, {
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
  const [tab, setTab] = useState<TabInfo>(null as any)

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
    <Box p4 h-360 w-300 column toBetween>
      <Box toBetween mt--4>
        <Logo size={28} />
        <Button
          colorScheme="neutral600"
          variant="light"
          size="sm"
          text-13--i
          onClick={() => {
            chrome.tabs.create({
              url: './tabs/editor.html',
            })
          }}>
          Open editor
        </Button>
      </Box>
      {/* <UserProfile /> */}
      {/* your currentUrl is: {tab?.url} */}
      <Box grid gridTemplateColumns-2 gap2>
        <FeatureEntry
          name="Write"
          icon={Text}
          type={ContentAppType.draggableEditor}
        />
        <FeatureEntry
          name="Clip Page"
          icon={Scissors}
          type={ContentAppType.areaSelect}
        />
        <FeatureEntry
          name="Screen Shot"
          icon={Monitor}
          type={ContentAppType.screenShot}
        />
        <FeatureEntry
          name="Voice"
          icon={Volume2}
          type={ContentAppType.screenShot}
        />
      </Box>

      <LocalSpacesSelect />
      {/* <SpacesSelect /> */}
    </Box>
  )
}
