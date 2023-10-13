import React, { FC, PropsWithChildren } from 'react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { useCatalogue } from '@penx/hooks'

interface Props {
  parentId?: string
}

export const NewDocButton: FC<PropsWithChildren<Props>> = ({ parentId }) => {
  const catalogue = useCatalogue()
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      onClick={() => catalogue.addNode(parentId)}
    >
      <Plus />
    </Button>
  )
}
