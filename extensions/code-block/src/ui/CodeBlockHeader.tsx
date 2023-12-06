import { Box } from '@fower/react'
import { Copy } from 'lucide-react'
import { Node } from 'slate'
import { Button, toast } from 'uikit'
import { IconCopy } from '@penx/icons'
import { useCopyToClipboard } from '@penx/shared'
import { CodeBlockElement } from '../types'
import { CodeBlockStatus, useCodeBlockContext } from './CodeBlockProvider'
import { CodeLangSelect } from './CodeLangSelect'
import { CodeMenuPopover } from './CodeMenuPopover'

const serialize = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join('\n')
}

interface Props {
  element: CodeBlockElement
}

export const CodeBlockHeader = ({ element }: Props) => {
  const { highlightingLines, title } = element
  const code = serialize(element.children as Node[])
  const { copy } = useCopyToClipboard()
  const { status, setStatus } = useCodeBlockContext()

  return (
    <Box px2 h10 toBetween toCenterY contentEditable={false}>
      <Box toCenterY gapX2>
        <CodeLangSelect element={element} />
        {!!title && (
          <Box gray400 textSM>
            {title}
          </Box>
        )}
        {!!highlightingLines?.length && (
          <Box gray400>
            {'{'}
            {highlightingLines.join(',')}
            {'}'}
          </Box>
        )}
      </Box>
      <Box toCenterY gapX1>
        {status === CodeBlockStatus.HIGHLIGHT_SETTING && (
          <Button
            colorScheme="black"
            size={28}
            roundedFull
            onClick={() => {
              setStatus(CodeBlockStatus.NORMAL)
            }}
          >
            Save
          </Button>
        )}
        <Button
          isSquare
          px0
          py0
          size={24}
          variant="ghost"
          gray400
          colorScheme="gray500"
          onClick={() => {
            copy(code)
            toast.info('Copied to clipboard')
          }}
        >
          <Copy size={14} />
        </Button>
        <CodeMenuPopover element={element} />
      </Box>
    </Box>
  )
}
