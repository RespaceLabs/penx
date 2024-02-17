import React, { FC, PropsWithChildren } from 'react'
import { FowerHTMLProps } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, ButtonProps } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { store } from '@penx/store'

interface Props
  extends ButtonProps,
    Omit<FowerHTMLProps<'button'>, 'children'> {
  //
}

export const NewNodeButton: FC<PropsWithChildren<Props>> = ({ ...rest }) => {
  return (
    <Button
      size="sm"
      variant="ghost"
      colorScheme="gray500"
      isSquare
      roundedFull
      onClick={(e) => {
        e.stopPropagation()
        store.node.createPageNode()
      }}
      {...rest}
    >
      <Plus />
    </Button>
  )
}
