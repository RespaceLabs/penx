import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/lib/shared'
import { Copy } from 'lucide-react'
import { Node } from 'slate'
import { toast } from 'sonner'
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
    <div
      className="px-2 h-10 flex items-center justify-between"
      contentEditable={false}
    >
      <div className="flex items-center gap-x-2">
        <CodeLangSelect element={element} />
        {!!title && <div className="text-foreground/40 text-sm">{title}</div>}
        {!!highlightingLines?.length && (
          <div className="text-foreground/40">
            {'{'}
            {highlightingLines.join(',')}
            {'}'}
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-1">
        {status === CodeBlockStatus.HIGHLIGHT_SETTING && (
          <Button
            size="sm"
            onClick={() => {
              setStatus(CodeBlockStatus.NORMAL)
            }}
          >
            Save
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            copy(code)
            toast.info('Copied to clipboard')
          }}
        >
          <Copy size={14} />
        </Button>
        <CodeMenuPopover element={element} />
      </div>
    </div>
  )
}
