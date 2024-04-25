import { FC } from 'react'
import { Box } from '@fower/react'

type Props = {
  icon?: FC<any>
  text: string
}

export const Title = ({ text, icon: Icon }: Props) => {
  return (
    <Box toCenterY fontBold mt8 mb3 gap3>
      {Icon && <Icon />}
      <Box>{text}</Box>
    </Box>
  )
}
