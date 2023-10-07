import { Box } from '@fower/react'
import { Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import { Checkbox } from 'uikit'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { CodeBlockElement, CodeLineElement } from '../types'
import { CodeBlockStatus, useCodeBlockContext } from './CodeBlockProvider'

export const CodeLine = ({
  attributes,
  element,
  children,
}: ElementProps<CodeLineElement>) => {
  const editor = useSlateStatic()
  const path = findNodePath(editor, element) || []
  const codeBlockPath = path.slice(0, -1)
  const codeBlock = getNodeByPath(editor, codeBlockPath) as CodeBlockElement
  const index = path[path.length - 1]! + 1
  const { highlightingLines = [] } = codeBlock
  const checked = highlightingLines.includes(index)
  const { status } = useCodeBlockContext()

  function select(checked: boolean) {
    let lines: number[] = []
    if (checked) {
      lines = [...highlightingLines, index]
    } else {
      lines = highlightingLines.filter((i) => i !== index)
    }

    Transforms.setNodes<CodeBlockElement>(
      editor,
      { highlightingLines: lines.sort() },
      {
        at: codeBlockPath,
      },
    )
  }

  return (
    <Box
      fontMono
      flex-1
      toCenterY
      gapX2
      px5
      w-100p
      h5
      bgGray200={checked}
      {...attributes}
    >
      {status === CodeBlockStatus.HIGHLIGHT_SETTING && (
        <Checkbox
          checked={checked}
          contentEditable={false}
          onChange={(v) => {
            const { checked } = v.target
            select(checked)
          }}
        />
      )}
      {codeBlock.showLineNumbers && (
        <Box gray400 contentEditable={false}>
          {index}
        </Box>
      )}
      <Box flex-1>{children}</Box>
    </Box>
  )
}
