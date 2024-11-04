import React, { FC } from 'react'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { findNodePath } from '@/lib/editor-queries'
import { PopoverClose } from '@radix-ui/react-popover'
import { Code, MoreHorizontal } from 'lucide-react'
import { Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { CodeBlockElement } from '../types'
import { CodeBlockStatus, useCodeBlockContext } from './CodeBlockProvider'

interface Props {
  element: CodeBlockElement
}

export const CodeMenuPopover: FC<Props> = ({ element }) => {
  const editor = useSlateStatic()
  const path = findNodePath(editor, element) || []
  const { status, setStatus } = useCodeBlockContext()
  const { showLineNumbers = false, title = '' } = element
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-foreground/40 cursor-pointer">
          <MoreHorizontal size={20} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverClose asChild>
          <div
            onClick={() => {
              setStatus(CodeBlockStatus.HIGHLIGHT_SETTING)
            }}
          >
            <Code size={18} />
            <div>Highlighting Lines Settings</div>
          </div>
        </PopoverClose>

        <div>
          <Switch
            checked={showLineNumbers}
            onChange={(e) => {
              Transforms.setNodes<CodeBlockElement>(
                editor,
                {
                  // showLineNumbers: e.target.checked,
                },
                { at: path },
              )
            }}
          >
            Show line numbers
          </Switch>
        </div>
        <div>
          <div>Title</div>
          <Input
            size="sm"
            placeholder="/src/index.ts"
            value={title}
            onChange={(e) => {
              Transforms.setNodes<CodeBlockElement>(
                editor,
                { title: e.target.value },
                { at: path },
              )
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
