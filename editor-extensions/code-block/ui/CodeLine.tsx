import { Checkbox } from '@/components/ui/checkbox'
import { findNodePath, getNodeByPath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
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
    <div
      className={cn(
        'font-mono flex flex-1 items-center gap-x-2 px-5 w-full h-5',
        checked && 'bg-foreground/10',
      )}
      {...attributes}
    >
      {status === CodeBlockStatus.HIGHLIGHT_SETTING && (
        <Checkbox
          checked={checked}
          contentEditable={false}
          onChange={(v) => {
            // const { checked } = v.target
            // select(checked)
          }}
        />
      )}
      {codeBlock.showLineNumbers && (
        <div className="text-foreground/40" contentEditable={false}>
          {index}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  )
}
