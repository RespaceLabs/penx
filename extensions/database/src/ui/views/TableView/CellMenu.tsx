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
import { IColumnNode, IRowNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { EditField } from './EditField'

interface ColumnMenuProps {
  row: IRowNode
  close: () => void
}

export function CellMenu({ row, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()

  return (
    <>
      <>
        <MenuItem
          gap2
          onClick={() => {
            // TODO: to render the row
            ctx.deleteRow(row.id)
            close()
          }}
        >
          <Box>
            <Trash2 size={16} />
          </Box>
          <Box>Delete</Box>
        </MenuItem>
      </>
    </>
  )
}
