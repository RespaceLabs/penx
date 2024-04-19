import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pen,
  Trash,
  Trash2,
} from 'lucide-react'
import { Input, MenuItem, modalController, usePopoverContext } from 'uikit'
import { ModalNames } from '@penx/constants'
import { IColumnNode } from '@penx/model-types'
import { useDatabaseContext } from '../../../DatabaseContext'
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
    <Box>
      <Box p2>
        <Box textXS gray400 mb1>
          Display name
        </Box>
        <Input
          size={isMobile ? 'md' : 'sm'}
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
      </Box>

      <Box p2>
        <Box textXS gray400 mb1>
          Column width
        </Box>
        <Input
          size={isMobile ? 'md' : 'sm'}
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
      </Box>

      {index !== 0 && (
        <MenuItem gap2 onClick={() => setIsEditField(true)}>
          <Box>
            <Pen size={16} />
          </Box>
          <Box>Edit Field</Box>
        </MenuItem>
      )}

      <MenuItem gap2 cursorNotAllowed opacity-60>
        <Box>
          <ArrowUp size={16} />
        </Box>
        <Box>Sort ascending</Box>
      </MenuItem>
      <MenuItem gap2 cursorNotAllowed opacity-60>
        <Box>
          <ArrowDown size={16} />
        </Box>
        <Box>Sort descending</Box>
      </MenuItem>

      {index !== 0 && (
        <>
          {index > 1 && (
            <MenuItem gap2 onClick={() => moveColumn(index, index - 1)}>
              <Box>
                <ArrowLeft size={16} />
              </Box>
              <Box>Move to left</Box>
            </MenuItem>
          )}

          {index < ctx.columns.length - 1 && (
            <MenuItem gap2 onClick={() => moveColumn(index, index + 1)}>
              <Box>
                <ArrowRight size={16} />
              </Box>
              <Box>Move to right</Box>
            </MenuItem>
          )}

          <MenuItem
            gap2
            onClick={() => {
              modalController.open(ModalNames.DELETE_COLUMN, column.id)
              close()
            }}
          >
            <Box>
              <Trash2 size={16} />
            </Box>
            <Box>Delete Column</Box>
          </MenuItem>
        </>
      )}
    </Box>
  )
}
