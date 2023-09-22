import React, { FC, PropsWithChildren } from 'react'
import { EllipsisHorizontalOutline, UserGroupOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
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
import { useDoc } from '@penx/hooks'
import { IconCopy } from '@penx/icons'
import { docToMarkdown, useCopyToClipboard } from '@penx/shared'
import { ExportToMarkdown } from './ExportToMarkdown'

interface Props {}

export const DocSettingsPopover: FC<PropsWithChildren<Props>> = () => {
  const { raw: doc } = useDoc()
  const { copy } = useCopyToClipboard()
  function copyMarkdown() {
    copy(docToMarkdown(doc))
    toast.success('Markdown copied to clipboard')
  }
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <Box square9 roundedFull toCenter bgGray200--hover cursorPointer>
          <EllipsisHorizontalOutline p0--i square6 stroke-2 />
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

        <ExportToMarkdown doc={doc} />

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
