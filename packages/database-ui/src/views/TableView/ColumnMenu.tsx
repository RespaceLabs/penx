import { useState } from 'react'
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
import { useDatabaseContext } from '../../DatabaseContext'
import { EditField } from './EditField'

interface ColumnMenuProps {
  index?: number
  column: IColumnNode
  close: () => void
}
export function ColumnMenu({ index = 0, column, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()
  const [name, setName] = useState(column.props.name)
  const [isEditField, setIsEditField] = useState(false)

  async function moveColumn(fromIndex: number, toIndex: number) {
    await ctx.moveColumn(fromIndex, toIndex)
    close()
  }

  async function updateColumnName() {
    await ctx.updateColumnName(column.id, name)
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
    <>
      <Box p2>
        <Input
          size="sm"
          value={name}
          // onBlur={() => {
          //   updateColumnName()
          // }}
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
    </>
  )
}
