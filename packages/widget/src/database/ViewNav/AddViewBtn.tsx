import React, { PropsWithChildren } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { Plus } from 'lucide-react'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { ViewType } from '@penx/model-types'
import { useDatabaseContext } from '../DatabaseContext'
import { ViewIcon } from './ViewIcon'

interface ItemProps extends PropsWithChildren<FowerHTMLProps<'div'>> {
  viewType: ViewType
}

function Item({ children, viewType, ...rest }: ItemProps) {
  const { close } = usePopoverContext()
  const ctx = useDatabaseContext()
  async function addColumn() {
    const view = await ctx.addView(viewType)
    ctx.setActiveViewId(view.id)
    close()
  }

  return (
    <Box
      toCenterY
      textSM
      gray800
      gap2
      cursorPointer
      bgGray100--hover
      rounded
      px2
      py2
      {...rest}
      onClick={addColumn}
    >
      {children}
    </Box>
  )
}

function Content() {
  return (
    <Box w-200 p2>
      <Item viewType={ViewType.TABLE}>
        <ViewIcon viewType={ViewType.TABLE} />
        <Box>Table</Box>
      </Item>

      <Item viewType={ViewType.LIST}>
        <ViewIcon viewType={ViewType.LIST} />
        <Box>List</Box>
      </Item>

      <Item viewType={ViewType.GALLERY}>
        <ViewIcon viewType={ViewType.GALLERY} />
        <Box>Gallery</Box>
      </Item>

      <Item viewType={ViewType.KANBAN}>
        <ViewIcon viewType={ViewType.KANBAN} />
        <Box>Kanban</Box>
      </Item>
    </Box>
  )
}

export const AddViewBtn = () => {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger asChild>
        <Button variant="ghost" colorScheme="gray500" size={24} isSquare p0>
          <Plus size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Content />
      </PopoverContent>
    </Popover>
  )
}
