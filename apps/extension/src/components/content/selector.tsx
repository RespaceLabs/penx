import { useEffect, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'

import Selector, { ISelectorRef } from './area-selector'
import DraggableEditor from './draggable-editor'
import {
  PENX_SANDBOX_BOARD_IFRAME,
  PENX_SELECTION_CONTAINER,
  StartSelectEnum,
} from './helper'
import ScreenShot, { IScreenShotRef } from './screen-shot'

interface IAppProps {
  type?: StartSelectEnum
  onSelectorMount: (ref: any) => void
}

export const App = (props: IAppProps) => {
  const { type = StartSelectEnum.areaSelect, onSelectorMount } = props
  const screenShotRef = useRef<IScreenShotRef>(null)
  const selectorRef = useRef<ISelectorRef>(null)
  const draggableEditorRef = useRef<ISelectorRef>(null)

  const refs = {
    [StartSelectEnum.areaSelect]: selectorRef,
    [StartSelectEnum.screenShot]: screenShotRef,
    [StartSelectEnum.draggableEditor]: draggableEditorRef,
  }

  useEffect(() => {
    setTimeout(() => {
      window.focus()
    }, 300)

    const handleKeyDown = async (e: KeyboardEvent) => {
      const { key } = e
      if (key === 'Escape' || key === 'Esc') {
        destroySelectArea()
      } else if (key === 'Enter') {
        if (type === StartSelectEnum.screenShot) {
          await screenShotRef.current?.onSave()
        } else if (type === StartSelectEnum.areaSelect) {
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
      {type === StartSelectEnum.areaSelect && (
        <Selector ref={selectorRef} destroySelectArea={destroySelectArea} />
      )}
      {type === StartSelectEnum.screenShot && (
        <ScreenShot ref={screenShotRef} destroySelectArea={destroySelectArea} />
      )}

      {type === StartSelectEnum.draggableEditor && (
        <DraggableEditor
          ref={draggableEditorRef}
          destroySelectArea={destroySelectArea}
        />
      )}
    </>
  )
}

let root: Root | null = null // Initialize root as null
let isRootMounted: boolean = false // Track root mount status
let selectorRef = null

export function initSelectArea(params: { type: StartSelectEnum }) {
  let wrapper = document.querySelector(`#${PENX_SELECTION_CONTAINER}`)
  if (!wrapper) {
    wrapper = document.createElement('div')
    wrapper.id = PENX_SELECTION_CONTAINER
    document.documentElement.appendChild(wrapper)
  }

  const onSelectortMount = (ref: any) => {
    selectorRef = ref
  }

  if (!root || !isRootMounted) {
    root = createRoot(wrapper) // Create root if it doesn't exist or is unmounted
    isRootMounted = true // Set root mount status to true
  }

  // If the component exists, destroy it
  if (selectorRef?.current?.type) {
    destroySelectArea()
    selectorRef = null
    return
  }

  root.render(<App type={params.type} onSelectorMount={onSelectortMount} />)
}

export function destroySelectArea(isOpenEditor = false) {
  if (!root || !isRootMounted) {
    return
  }

  const wrapper = document.querySelector(`#${PENX_SELECTION_CONTAINER}`)

  root.unmount()
  isRootMounted = false // Set root mount status to false

  wrapper?.remove()

  document.querySelector(`#${PENX_SANDBOX_BOARD_IFRAME}`)?.classList.add('show')
  if (isOpenEditor) {
    initSelectArea({
      type: StartSelectEnum.draggableEditor,
    })
  }
}
