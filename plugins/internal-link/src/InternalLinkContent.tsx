import { Box } from '@fower/react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'uikit'
import { ElementProps } from '@penx/plugin-typings'
import { InternalLinkContentElement } from '../custom-types'

export const InternalLinkContent = ({
  element,
  children,
  attributes,
}: ElementProps<InternalLinkContentElement>) => {
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
