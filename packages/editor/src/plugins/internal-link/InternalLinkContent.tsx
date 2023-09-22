import { Box } from '@fower/react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'uikit'
import { ElementProps, InternalLinkContentElement } from '@penx/editor-types'
import { useEditorContext } from '../../components/EditorProvider'

export const InternalLinkContent = ({
  element,
  children,
  attributes,
}: ElementProps<InternalLinkContentElement>) => {
  const { space } = useEditorContext()
  const url = `/spaces/${space?.id}/docs/${element.linkId}`

  return (
    <Tooltip>
      <TooltipTrigger>
        <Box
          as="a"
          href={url}
          textBase
          inlineFlex
          relative
          toCenterY
          brand500
          {...attributes}
          onClick={(e) => {
            e.preventDefault()
            location.href = url
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
