import { Box } from '@fower/react'
import { TitleElement } from '../../types'

interface Props {
  element: TitleElement
}

export const TagMenu = ({ element }: Props) => {
  return (
    <Box absolute toCenterY left3 top-2 h="1.5em">
      <Box
        contentEditable={false}
        bg={element.props?.color || 'black'}
        square="1.5em"
        textSM
        white
        roundedFull
        toCenter
      >
        #
      </Box>
    </Box>
  )
}
