import { useEffect, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'

import Selector, { ISelectorRef } from './area-selector'
import {
  ContentAppType,
  PENX_SANDBOX_BOARD_IFRAME,
  PENX_SELECTION_CONTAINER,
} from './constants'
import DraggableEditor from './draggable-editor'
import ScreenShot, { IScreenShotRef } from './screen-shot'

interface IAppProps {
  type?: ContentAppType
  onSelectorMount: (ref: any) => void
}

export const ContentApp = (props: IAppProps) => {
  const { type = ContentAppType.areaSelect, onSelectorMount } = props
  const screenShotRef = useRef<IScreenShotRef>(null)
  const selectorRef = useRef<ISelectorRef>(null)
  const draggableEditorRef = useRef<ISelectorRef>(null)

  const refs = {
    [ContentAppType.areaSelect]: selectorRef,
    [ContentAppType.screenShot]: screenShotRef,
    [ContentAppType.draggableEditor]: draggableEditorRef,
  }

  useEffect(() => {
    setTimeout(() => {
      window.focus()
    }, 300)

    const handleKeyDown = async (e: KeyboardEvent) => {
      const { key } = e
      if (key === 'Escape' || key === 'Esc') {
        destroyContentApp()
      } else if (key === 'Enter') {
        if (type === ContentAppType.screenShot) {
          await screenShotRef.current?.onSave()
        } else if (type === ContentAppType.areaSelect) {
          selectorRef.current?.onSave()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    onSelectorMount(refs[type])

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      {type === ContentAppType.areaSelect && (
        <Selector ref={selectorRef} destroySelectArea={destroyContentApp} />
      )}
      {type === ContentAppType.screenShot && (
        <ScreenShot ref={screenShotRef} destroySelectArea={destroyContentApp} />
      )}

      {type === ContentAppType.draggableEditor && (
        <DraggableEditor
          ref={draggableEditorRef}
          destroySelectArea={destroyContentApp}
        />
      )}
    </>
  )
}

let root: Root | null = null // Initialize root as null
let isRootMounted: boolean = false // Track root mount status
let selectorRef = null

export function initContentApp(params: { type: ContentAppType }) {
  let wrapper = document.querySelector(`#${PENX_SELECTION_CONTAINER}`)
  if (!wrapper) {
    wrapper = document.createElement('div')
    wrapper.id = PENX_SELECTION_CONTAINER
    document.documentElement.appendChild(wrapper)
  }

  const onSelectorMount = (ref: any) => {
    selectorRef = ref
  }

  if (!root || !isRootMounted) {
    root = createRoot(wrapper) // Create root if it doesn't exist or is unmounted
    isRootMounted = true // Set root mount status to true
  }

  // If the component exists, destroy it
  if (selectorRef?.current?.type) {
    destroyContentApp()
    selectorRef = null
    return
  }

  root.render(
    <ContentApp type={params.type} onSelectorMount={onSelectorMount} />,
  )
}

export function destroyContentApp(isOpenEditor = false) {
  if (!root || !isRootMounted) {
    return
  }

  const wrapper = document.querySelector(`#${PENX_SELECTION_CONTAINER}`)

  root.unmount()
  isRootMounted = false // Set root mount status to false

  wrapper?.remove()

  document.querySelector(`#${PENX_SANDBOX_BOARD_IFRAME}`)?.classList.add('show')
  if (isOpenEditor) {
    initContentApp({
      type: ContentAppType.draggableEditor,
    })
  }
}
