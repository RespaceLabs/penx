'use client'

import React, { forwardRef, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { ViewField } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { useDatabaseContext } from '../../DatabaseProvider'
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

  viewField: ViewField
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const { currentView, updateViewField, database } = useDatabaseContext()
    const {
      viewField,
      index,
      id,
      dragOverlay,
      isDragging,
      isSorting,
      attributes,
      listeners,
      ...rest
    } = props
    const { fields } = database
    const field = fields.find((i) => i.id === viewField.fieldId)!
    // console.log('=====props.viewField:', props.viewField)

    const [visible, setVisible] = useState(props.viewField.visible)

    async function toggleVisible(visible: boolean) {
      setVisible(visible)
      await updateViewField(viewField.fieldId, { visible })
    }

    return (
      <div
        ref={ref}
        key={viewField.fieldId}
        className={cn(
          'bg-background p-2 rounded flex items-center justify-between',
          isDragging && 'shadow',
          isDragging && 'z-[1000000]',
        )}
        {...rest}
      >
        <div className="flex items-center gap-1">
          <Switch
            disabled={index === 0}
            checked={visible}
            onCheckedChange={(checked) => {
              toggleVisible(checked)
            }}
          />
          <FieldIcon size={16} fieldType={field.fieldType as any} />
          <div className="text-sm text-foreground/60">{field.displayName}</div>
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
