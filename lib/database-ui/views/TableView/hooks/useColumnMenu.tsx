import { useState } from 'react'
import { useLayer } from 'react-laag'
import { IColumnNode } from '@/lib/model'

import { Rectangle } from '@glideapps/glide-data-grid'
import { ColumnMenu } from '../ColumnMenu/ColumnMenu'

export const useColumnMenu = (columns: IColumnNode[]) => {
  const [menu, setMenu] = useState<{
    col: number
    bounds: Rectangle
  }>()

  const isOpen = menu !== undefined
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: 'bottom-end',
    triggerOffset: 2,
    onOutsideClick: () => setMenu(undefined),
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
            className="shadow bg-background rounded-lg overflow-hidden"
          >
            <ColumnMenu
              index={menu.col}
              column={columns[menu.col]}
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
