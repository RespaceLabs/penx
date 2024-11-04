import React, { forwardRef, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useDatabaseContext } from '@/lib/database-context'
import { ViewColumn } from '@/lib/model'
import { cn } from '@/lib/utils'
import { DraggableSyntheticListeners } from '@dnd-kit/core'

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
      <div
        ref={ref}
        key={viewColumn.columnId}
        className={cn(
          'bg-background py-2 px-2 rounded flex justify-between',
          isDragging && 'shadow',
          isDragging && 'z-50',
        )}
        {...rest}
      >
        <div className="flex gap-1">
          <Switch
            // disabled={index === 0}
            checked={visible}
            // onChange={(e) => toggleVisible(e.target.checked)}
          />
          <FieldIcon size={16} fieldType={column.props.fieldType} />
          <div className="text-sm text-foreground/60">
            {column.props.displayName}
          </div>
        </div>

        {/* <IconDrag
          {...attributes}
          {...(index === 0 ? {} : listeners)}
          cursorNotAllowed={index === 0}
          outlineNone--focus
        /> */}
      </div>
    )
  },
)
