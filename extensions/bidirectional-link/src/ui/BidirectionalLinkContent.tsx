import { Box } from '@fower/react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { BidirectionalLinkContentElement } from '../types'

export const BidirectionalLinkContent = ({
  element,
  children,
  attributes,
}: ElementProps<BidirectionalLinkContentElement>) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Box
          textBase
          inlineFlex
          relative
          toCenterY
          brand500
          {...attributes}
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          {children}
          {element.linkName}
        </Box>
      </TooltipTrigger>
      <TooltipContent>
        <Box>TODO...</Box>
      </TooltipContent>
    </Tooltip>
  )
}
