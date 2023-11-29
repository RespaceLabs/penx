import { useState } from 'react'
import { Box } from '@fower/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trash2 } from 'lucide-react'
import { Input, MenuItem, usePopoverContext } from 'uikit'
import { useDatabaseContext } from '../../DatabaseContext'

interface ColumnMenuProps {
  index: number
  columnId: string
  columnName: string
}
export function ColumnMenu({ index, columnId, columnName }: ColumnMenuProps) {
  const { close } = usePopoverContext()
  const ctx = useDatabaseContext()
  const [name, setName] = useState(columnName)

  async function deleteColumn() {
    await ctx.deleteColumn(columnId)
    close()
  }

  async function moveColumn(fromIndex: number, toIndex: number) {
    await ctx.moveColumn(fromIndex, toIndex)
    close()
  }

  async function updateColumnName() {
    await ctx.updateColumnName(columnId, name)
    close()
  }

  return (
    <>
      <Box p2>
        <Input
          size="sm"
          value={name}
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
      <MenuItem gap2>
        <Box>
          <ArrowUp size={16} />
        </Box>
        <Box>Sort ascending</Box>
      </MenuItem>
      <MenuItem gap2>
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

          <MenuItem onClick={deleteColumn} gap2>
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
