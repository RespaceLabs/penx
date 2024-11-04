import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Input } from '@/components/ui/input'
import { useDatabaseContext } from '@/lib/database-context'
import { IColumnNode } from '@/lib/model'

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pen,
  Trash,
  Trash2,
} from 'lucide-react'
import { EditField } from './EditField'

interface ColumnMenuProps {
  index?: number
  column: IColumnNode
  close: () => void
}
export function ColumnMenu({ index = 0, column, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()
  const [name, setName] = useState(column.props.displayName)
  const [isEditField, setIsEditField] = useState(false)

  const viewColumn = ctx.currentView.props.viewColumns.find(
    (i) => i.columnId === column.id,
  )!
  const [width, setWidth] = useState(viewColumn.width || 120)

  async function moveColumn(fromIndex: number, toIndex: number) {
    await ctx.moveColumn(fromIndex, toIndex)
    close()
  }

  async function updateColumnName() {
    await ctx.updateColumnName(column.id, name)
    close()
  }

  async function updateColumnWidth() {
    await ctx.updateColumnWidth(column.id, Number(width as any))
    close()
  }

  if (isEditField) {
    return (
      <EditField
        close={close}
        column={column}
        onSave={() => setIsEditField(false)}
      />
    )
  }

  return (
    <div>
      <div className="p-2">
        <div className="text-xs text-foreground/40 mb-1">Display name</div>
        <Input
          value={name}
          onBlur={() => {
            updateColumnName()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateColumnName()
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

      {index !== 0 && (
        <div onClick={() => setIsEditField(true)}>
          <div>
            <Pen size={16} />
          </div>
          <div>Edit Field</div>
        </div>
      )}

      <div>
        <div>
          <ArrowUp size={16} />
        </div>
        <div>Sort ascending</div>
      </div>
      <div>
        <div>
          <ArrowDown size={16} />
        </div>
        <div>Sort descending</div>
      </div>

      {index !== 0 && (
        <>
          {index > 1 && (
            <div onClick={() => moveColumn(index, index - 1)}>
              <div>
                <ArrowLeft size={16} />
              </div>
              <div>Move to left</div>
            </div>
          )}

          {index < ctx.columns.length - 1 && (
            <div onClick={() => moveColumn(index, index + 1)}>
              <div>
                <ArrowRight size={16} />
              </div>
              <div>Move to right</div>
            </div>
          )}

          <div
            onClick={() => {
              // modalController.open(ModalNames.DELETE_COLUMN, column.id)
              // close()
            }}
          >
            <div>
              <Trash2 size={16} />
            </div>
            <div>Delete Column</div>
          </div>
        </>
      )}
    </div>
  )
}
