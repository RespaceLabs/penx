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
import {
  Input,
  MenuItem,
  modalController,
  toast,
  usePopoverContext,
} from 'uikit'
import { ModalNames } from '@penx/constants'
import { extractTags } from '@penx/editor-common'
import { IColumnNode, IRowNode } from '@penx/model-types'
import { useNodes } from '@penx/node-hooks'
import { useDatabaseContext } from '../../DatabaseContext'
import { EditField } from './ColumnMenu/EditField'

interface ColumnMenuProps {
  row: IRowNode
  close: () => void
}

export function CellMenu({ row, close }: ColumnMenuProps) {
  const ctx = useDatabaseContext()
  const { nodes } = useNodes()

  async function deleteRow() {
    const cells = ctx.cells.filter((c) => c.props.rowId === row.id)

    const primaryCell = cells.find(
      (cell) => !!cell.props.ref && cell.props.rowId === row.id,
    )

    if (primaryCell) {
      const refNode = nodes.find((n) => n.id === primaryCell.props.ref)

      if (refNode) {
        const tags = extractTags(refNode?.element)

        if (tags.length > 1) {
          toast.info(
            'This row has more than one tags, you can not delete it directly, please go to original node to delete the tag first',
          )
          return
        }
      }
    }

    ctx.deleteRow(row.id)
    close()
  }

  return (
    <>
      <>
        <MenuItem
          gap2
          onClick={async () => {
            deleteRow()
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
