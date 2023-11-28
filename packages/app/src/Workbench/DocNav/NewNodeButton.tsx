import React, { FC, PropsWithChildren } from 'react'
import { Plus } from 'lucide-react'
import { useAccount } from 'wagmi'
import { Button } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

interface Props {}

export const NewNodeButton: FC<PropsWithChildren<Props>> = () => {
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      roundedFull
      onClick={() => store.node.createPageNode()}
    >
      <Plus />
    </Button>
  )
}
