import React, { forwardRef } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Box } from '@fower/react'
import { Switch } from 'uikit'
import { IconDrag } from '@penx/icons'
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

  viewColumn: any
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const { columns } = useDatabaseContext()
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

    console.log('======column:', columns)
    const column = columns.find((i) => i.id === viewColumn.id)!
    return <div>gog</div>

    async function toggleVisible(visible: boolean, id: string) {
      //
    }

    return (
      <Box
        ref={ref}
        key={viewColumn.id}
        bgWhite
        py1
        toBetween
        shadow={!!dragOverlay}
        zIndex-10000={dragOverlay}
        opacity-50={isDragging}
        {...rest}
      >
        <Box toLeft gap1>
          <IconDrag
            {...attributes}
            {...(index === 0 ? {} : listeners)}
            cursorNotAllowed={index === 0}
            outlineNone--focus
          />
          <FieldIcon size={18} fieldType={column.props.fieldType} />
          <Box>{column.props.name}</Box>
        </Box>
        <Switch
          checked={viewColumn.visible}
          size={12}
          mr-4
          onChange={(e) => toggleVisible(e.target.checked, id)}
        />
      </Box>
    )
  },
)
