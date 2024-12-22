'use client'

import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pen,
  Trash,
  Trash2,
} from 'lucide-react'
import { useDatabaseContext } from '@/components/database-ui/DatabaseProvider'
import { Input } from '@/components/ui/input'
import { Menu, MenuItem } from '@/components/ui/menu'
import { IColumnNode } from '@/lib/model'
import { Field } from '@/server/db/schema'
import { useDeleteFieldDialog } from '../DeleteFieldDialog/useDeleteFieldDialog'
import { EditField } from './EditField'

interface ColumnMenuProps {
  index?: number
  field: Field
  close: () => void
}
export function ColumnMenu({ index = 0, field, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()
  const [name, setName] = useState(field.displayName || '')
  const [isEditField, setIsEditField] = useState(false)
  const { setState } = useDeleteFieldDialog()

  const viewField = ctx.currentView.viewFields.find(
    (i) => i.fieldId === field.id,
  )!
  const [width, setWidth] = useState(viewField.width || 120)

  async function moveField(fromIndex: number, toIndex: number) {
    await ctx.sortFields(fromIndex, toIndex)
    close()
  }

  async function updateFieldName() {
    await ctx.updateFieldName(field.id, name)
    close()
  }

  async function updateColumnWidth() {
    await ctx.updateColumnWidth(field.id, Number(width as any))
    close()
  }

  if (isEditField) {
    return (
      <EditField
        close={close}
        field={field}
        onSave={() => setIsEditField(false)}
        onCancel={() => setIsEditField(false)}
      />
    )
  }

  return (
    <div>
      <div className="p-2">
        <div className="text-sm text-foreground/40 mb-1">Display name</div>
        <Input
          size="sm"
          value={name}
          onBlur={() => {
            updateFieldName()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFieldName()
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>

      <div className="p-2">
        <div className="text-sm text-foreground/40 mb-1">Column width</div>
        <Input
          size="sm"
          type="number"
          value={width}
          onBlur={() => {
            updateColumnWidth()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateColumnWidth()
            }
          }}
          onChange={(e) => {
            setWidth(Number(e.target.value))
          }}
        />
      </div>

      <Menu>
        {index !== 0 && (
          <MenuItem className="gap-2" onClick={() => setIsEditField(true)}>
            <div>
              <Pen size={16} />
            </div>
            <div>Edit Field</div>
          </MenuItem>
        )}

        <MenuItem className="gap-2">
          <div>
            <ArrowUp size={16} />
          </div>
          <div>Sort ascending</div>
        </MenuItem>
        <MenuItem className="gap-2">
          <div>
            <ArrowDown size={16} />
          </div>
          <div>Sort descending</div>
        </MenuItem>

        {index !== 0 && (
          <>
            {index > 1 && (
              <MenuItem
                className="gap-2"
                onClick={() => moveField(index, index - 1)}
              >
                <div>
                  <ArrowLeft size={16} />
                </div>
                <div>Move to left</div>
              </MenuItem>
            )}

            {index < ctx.database.fields.length - 1 && (
              <MenuItem
                className="gap-2"
                onClick={() => moveField(index, index + 1)}
              >
                <div>
                  <ArrowRight size={16} />
                </div>
                <div>Move to right</div>
              </MenuItem>
            )}

            <MenuItem
              className="gap-2"
              onClick={() => {
                setState({
                  isOpen: true,
                  field,
                })
                close()
              }}
            >
              <div>
                <Trash2 size={16} />
              </div>
              <div>Delete field</div>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}
