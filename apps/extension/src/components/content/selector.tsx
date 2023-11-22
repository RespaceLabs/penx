import { useEffect, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'

import Selector, { ISelectorRef } from './area-selector'
import {
  PENX_SANDBOX_BOARD_IFRAME,
  PENX_SELECTION_CONTAINER,
  StartSelectEnum,
} from './helper'
import ScreenShot, { IScreenShotRef } from './screen-shot'

interface IAppProps {
  type?: StartSelectEnum
}

export const App = (props: IAppProps) => {
  const { type = StartSelectEnum.areaSelect } = props
  const screenShotRef = useRef<IScreenShotRef>(null)
  const selectorRef = useRef<ISelectorRef>(null)

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
    </>
  )
}

let root: Root

export function initSelectArea(params: { type: StartSelectEnum }) {
  let wrapper = document.querySelector(`#${PENX_SELECTION_CONTAINER}`)
  if (!wrapper) {
    wrapper = document.createElement('div')
    wrapper.id = PENX_SELECTION_CONTAINER
    document.documentElement.appendChild(wrapper)
  }

  root = createRoot(wrapper)
  root.render(<App type={params.type} />)
}

export function destroySelectArea() {
  if (!root) {
    return
  }

  const wrapper = document.querySelector(`#${PENX_SELECTION_CONTAINER}`)

  root.unmount()

  wrapper?.remove()

  document.querySelector(`#${PENX_SANDBOX_BOARD_IFRAME}`)?.classList.add('show')
}
