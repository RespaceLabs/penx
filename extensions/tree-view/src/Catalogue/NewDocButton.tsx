import React, { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { useCatalogue } from '@penx/hooks'

interface Props {
  parentId?: string
}

export const NewDocButton: FC<PropsWithChildren<Props>> = ({ parentId }) => {
  const catalogue = useCatalogue()
  return (
    <Box
      inlineFlex
      bgGray200--hover
      rounded
      cursorPointer
      gray600
      p-2
      onClick={() => catalogue.addNode(parentId)}
    >
      <Plus size={16} />
    </Box>
  )
}
