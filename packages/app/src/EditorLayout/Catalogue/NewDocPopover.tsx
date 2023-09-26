import React, { FC, PropsWithChildren, useEffect } from 'react'
import { DocumentOutline, LinkOutline, UserGroupOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import {
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { CatalogueNodeType } from '@penx/catalogue'
import { useCatalogue } from '@penx/hooks'

interface Props {
  parentId?: string
}

export const NewDocPopover: FC<PropsWithChildren<Props>> = ({
  children,
  parentId,
}) => {
  const catalogue = useCatalogue()
  return (
    <Popover placement="right-start">
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent w-200 textSM>
        <Box>
          <PopoverClose asChild>
            <MenuItem
              gap2
              onClick={async () => {
                await catalogue.addNode(CatalogueNodeType.DOC, parentId)
              }}
            >
              <DocumentOutline size={18} />
              <Box>Create Doc</Box>
            </MenuItem>
          </PopoverClose>

          <PopoverClose asChild>
            <MenuItem
              gap2
              onClick={() => {
                catalogue.addNode(CatalogueNodeType.GROUP, parentId)
              }}
            >
              <UserGroupOutline size={18} />
              <Box>New Group</Box>
            </MenuItem>
          </PopoverClose>

          <PopoverClose asChild>
            <MenuItem gap2>
              <LinkOutline size={18} />
              <Box>Add Link</Box>
            </MenuItem>
          </PopoverClose>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
