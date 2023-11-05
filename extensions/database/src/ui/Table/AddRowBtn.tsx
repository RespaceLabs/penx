import React, { FC } from 'react'
import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { useDatabaseContext } from '../DatabaseContext'

interface Props {}

export const AddRowBtn: FC<Props> = ({}) => {
  const ctx = useDatabaseContext()
  async function onAddRow() {
    ctx.addRow()
  }

  return (
    <Box row>
      <Box
        onClick={onAddRow}
        toCenter
        cursorPointer
        w-50
        h-40
        borderBottom
        borderLeft
        borderRight
      >
        <Box gray500>
          <Plus size={20} />
        </Box>
      </Box>
      <Box></Box>
    </Box>
  )
}
