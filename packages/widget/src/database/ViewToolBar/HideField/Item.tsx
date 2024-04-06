import React, { forwardRef, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Box } from '@fower/react'
import { Switch } from 'uikit'
import { IconDrag } from '@penx/icons'
import { db } from '@penx/local-db'
import { ViewColumn } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { FieldIcon } from '../../shared/FieldIcon'

interface Props {
  dragging?: boolean
  dragOverlay?: boolean
  isDragging?: boolean
  isSorting?: boolean

  /** for drag handle */
  listeners?: DraggableSyntheticListeners

  /** for drag handle */
  attributes?: any

  id: string

  index?: number

  style?: any

  viewColumn: ViewColumn
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const { columns, currentView, updateViewColumn } = useDatabaseContext()
    const {
      viewColumn,
      index,
      id,
      dragOverlay,
      isDragging,
      isSorting,
      attributes,
      listeners,
      ...rest
    } = props

    const column = columns.find((i) => i.id === viewColumn.columnId)!
    const [visible, setVisible] = useState(props.viewColumn.visible)

    async function toggleVisible(visible: boolean) {
      setVisible(visible)
      await updateViewColumn(currentView.id, viewColumn.columnId, { visible })
    }

    return (
      <Box
        ref={ref}
        key={viewColumn.columnId}
        bgWhite
        py2
        px2
        rounded
        toBetween
        // shadow={!!dragOverlay}
        // zIndex-10000000={!!dragOverlay}
        shadow={isDragging}
        zIndex-10000000={isDragging}
        // opacity-50={isDragging}
        {...rest}
      >
        <Box toLeft gap1>
          <Switch
            disabled={index === 0}
            size={12}
            mr-4
            checked={visible}
            onChange={(e) => toggleVisible(e.target.checked)}
          />
          <FieldIcon size={16} fieldType={column.props.fieldType} />
          <Box textSM gray600>
            {column.props.name}
          </Box>
        </Box>

        <IconDrag
          {...attributes}
          {...(index === 0 ? {} : listeners)}
          cursorNotAllowed={index === 0}
          outlineNone--focus
        />
      </Box>
    )
  },
)
