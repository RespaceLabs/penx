import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'uikit'
import { useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { store } from '@penx/store'
import { BidirectionalLinkContentElement } from '../types'

export const BidirectionalLinkContent = ({
  element,
  children,
  attributes,
}: ElementProps<BidirectionalLinkContentElement>) => {
  const editor = useEditorStatic()
  let selected = useSelected()
  const { linkId } = element
  const node = editor.items.find((item) => item.id === linkId)

  const trigger = (
    <Box
      textBase
      inlineFlex
      relative
      toCenterY
      rounded
      py1
      px1
      bgGray100={selected}
      cursorPointer
      {...attributes}
      contentEditable={false}
      onClick={(e) => {
        e.preventDefault()
        store.node.selectNode(node?.raw!)
      }}
    >
      {children}
      <Box gray400>
        <Box as="span">[[</Box>
        <Box as="span" brand500 inlineFlex>
          {node?.title || 'Untitled'}
        </Box>
        <Box as="span">]]</Box>
      </Box>
    </Box>
  )

  return trigger

  return (
    <Tooltip>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent shadow bgWhite black w-400 h-300>
        <Box gray500>Coming soon...</Box>
      </TooltipContent>
    </Tooltip>
  )
}
