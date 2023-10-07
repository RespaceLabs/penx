import React, { FC, PropsWithChildren } from 'react'
import { CodeBracketSolid, EllipsisHorizontalOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import {
  Divider,
  Input,
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from 'uikit'
import { findNodePath } from '@penx/editor-queries'
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
    <Popover placement="bottom">
      <PopoverTrigger asChild>
        <EllipsisHorizontalOutline
          p0--i
          square6
          cursorPointer
          rounded
          bgGray200--hover
          stroke-2
        />
      </PopoverTrigger>
      <PopoverContent w-260 textSM>
        <Box>
          <PopoverClose asChild>
            <MenuItem
              gap2
              onClick={() => {
                setStatus(CodeBlockStatus.HIGHLIGHT_SETTING)
              }}
            >
              <CodeBracketSolid size={18} />
              <Box>Highlighting Lines Settings</Box>
            </MenuItem>
          </PopoverClose>

          <MenuItem>
            <Switch
              size="sm"
              rowReverse
              flex-1
              toBetween
              checked={showLineNumbers}
              onChange={(e) => {
                Transforms.setNodes<CodeBlockElement>(
                  editor,
                  { showLineNumbers: e.target.checked },
                  { at: path },
                )
              }}
            >
              Show line numbers
            </Switch>
          </MenuItem>
          <Divider />
          <MenuItem gap2 column>
            <Box>Title</Box>
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
          </MenuItem>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
