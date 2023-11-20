import React, { FC, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Switch,
  toast,
} from 'uikit'
import { useNodeContext } from '@penx/hooks'
import { IconCopy } from '@penx/icons'
import { useCopyToClipboard } from '@penx/shared'
import { ExportToMarkdown } from './ExportToMarkdown'

interface Props {}

export const PageSettingsPopover: FC<PropsWithChildren<Props>> = () => {
  const { node } = useNodeContext()
  const { copy } = useCopyToClipboard()
  function copyMarkdown() {
    //
  }
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Box square9 roundedFull toCenter bgGray200--hover cursorPointer>
          <MoreHorizontal size={24} />
        </Box>
      </PopoverTrigger>

      <PopoverContent w-240>
        <MenuItem>
          <Switch size="sm" rowReverse flex-1 toBetween>
            Small text
          </Switch>
        </MenuItem>

        <MenuItem>
          <Switch size="sm" rowReverse flex-1 toBetween>
            Full width
          </Switch>
        </MenuItem>

        <PopoverClose asChild>
          <MenuItem
            gap2
            onClick={() => {
              copyMarkdown()
            }}
          >
            <IconCopy />
            <Box>Copy as Markdown</Box>
          </MenuItem>
        </PopoverClose>

        <ExportToMarkdown node={node} />

        <PopoverClose asChild>
          <MenuItem gap2>
            <Avatar size={20}>
              <AvatarFallback bgBlack>P</AvatarFallback>
            </Avatar>
            <Box>Export to PDF</Box>
          </MenuItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
