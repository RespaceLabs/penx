import { Box } from '@fower/react'
import { ListContentElement } from '../types'

interface Props {
  element: ListContentElement
}

export const Bullet = ({ element }: Props) => {
  const { collapsed = false } = element

  return (
    <Box
      className="bullet"
      square-15
      bgTransparent
      bgGray200={collapsed}
      toCenter
      roundedFull
      cursorPointer
      flexShrink-1
    >
      <Box
        square-5
        bgGray400
        roundedFull
        transitionCommon
        scale-130--$bullet--hover
      />
    </Box>
  )
}
