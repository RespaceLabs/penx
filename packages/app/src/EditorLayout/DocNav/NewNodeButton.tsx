import React, { FC, PropsWithChildren } from 'react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { store } from '@penx/store'

interface Props {}

export const NewNodeButton: FC<PropsWithChildren<Props>> = () => {
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      onClick={() => store.createPageNode()}
    >
      <Plus />
    </Button>
  )
}
