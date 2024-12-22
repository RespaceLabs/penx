'use client'

import { useState } from 'react'
import { useLayer } from 'react-laag'
import { Field } from '@/server/db/schema'
import { Rectangle } from '@glideapps/glide-data-grid'
import { ColumnMenu } from '../ColumnMenu/ColumnMenu'
import { useFieldTypeSelectPopover } from './useFieldTypeSelectPopover'

export const useColumnMenu = (fields: Field[]) => {
  const [menu, setMenu] = useState<{
    col: number
    bounds: Rectangle
  }>()

  const fieldTypeSelectPopover = useFieldTypeSelectPopover()
  const isOpen = menu !== undefined
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: 'bottom-end',
    triggerOffset: 2,
    onOutsideClick: () => {
      if (!fieldTypeSelectPopover.isOpen) {
        setMenu(undefined)
      }
    },
    trigger: {
      getBounds: () => ({
        left: menu?.bounds.x ?? 0,
        top: menu?.bounds.y ?? 0,
        width: menu?.bounds.width ?? 0,
        height: menu?.bounds.height ?? 0,
        right: (menu?.bounds.x ?? 0) + (menu?.bounds.width ?? 0),
        bottom: (menu?.bounds.y ?? 0) + (menu?.bounds.height ?? 0),
      }),
    },
  })

  const columnMenuUI = (
    <>
      {isOpen &&
        renderLayer(
          <div
            {...layerProps}
            className="shadow-md border bg-popover rounded-lg overflow-hidden w-[260px]"
          >
            <ColumnMenu
              index={menu.col}
              field={fields[menu.col]}
              close={() => setMenu(undefined)}
            />
          </div>,
        )}
    </>
  )

  return {
    setColumnMenu: setMenu,
    columnMenuUI,
  }
}
