import { Box } from '@fower/react'
import { Node } from 'slate'
import { Button, toast } from 'uikit'
import { FrontMatterBlockElement } from '@penx/editor-types'
import { IconCopy } from '@penx/icons'
import { useCopyToClipboard } from '@penx/shared'

const serialize = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n')
}

interface Props {
  element: FrontMatterBlockElement
}

export const FrontMatterHeader = ({ element }: Props) => {
  const code = serialize(element.children)
  const { copy } = useCopyToClipboard()

  return (
    <Box pl5 pr2 h10 toBetween toCenterY contentEditable={false}>
      <Box toCenterY fontSemibold gray400>
        Front Matter
      </Box>
      <Box toCenterY gapX1>
        <Button
          isSquare
          px0
          py0
          size={24}
          variant="ghost"
          gray800
          colorScheme="gray500"
          onClick={() => {
            copy(code)
            toast.info('Copied to clipboard')
          }}
        >
          <IconCopy square-16 />
        </Button>
      </Box>
    </Box>
  )
}
