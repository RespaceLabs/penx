import React, { FC, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { Plus } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { FieldType } from '@penx/model-types'
import { useDatabaseContext } from '../DatabaseContext'
import { FieldIcon } from '../shared/FieldIcon'

interface ItemProps extends PropsWithChildren<FowerHTMLProps<'div'>> {
  fieldType: FieldType
}

function Item({ children, fieldType, ...rest }: ItemProps) {
  const { close } = usePopoverContext()
  const ctx = useDatabaseContext()
  async function addColumn() {
    await ctx.addColumn(fieldType)
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
      <Item fieldType={FieldType.TEXT}>
        <FieldIcon fieldType={FieldType.TEXT} />
        <Box>Text</Box>
      </Item>
      <Item fieldType={FieldType.NUMBER}>
        <FieldIcon fieldType={FieldType.NUMBER} />
        <Box>Number</Box>
      </Item>

      <Item fieldType={FieldType.PASSWORD}>
        <FieldIcon fieldType={FieldType.PASSWORD} />
        <Box>Password</Box>
      </Item>

      <Item fieldType={FieldType.SINGLE_SELECT}>
        <FieldIcon fieldType={FieldType.SINGLE_SELECT} />
        <Box>Single Select</Box>
      </Item>

      <Item fieldType={FieldType.MULTIPLE_SELECT}>
        <FieldIcon fieldType={FieldType.MULTIPLE_SELECT} />
        <Box>Multiple Select</Box>
      </Item>

      <Item fieldType={FieldType.DATE}>
        <FieldIcon fieldType={FieldType.DATE} />
        <Box>Date</Box>
      </Item>

      <Item fieldType={FieldType.CREATED_AT}>
        <FieldIcon fieldType={FieldType.CREATED_AT} />
        <Box>Created At</Box>
      </Item>

      <Item fieldType={FieldType.UPDATED_AT}>
        <FieldIcon fieldType={FieldType.UPDATED_AT} />
        <Box>Updated At</Box>
      </Item>
    </Box>
  )
}

interface Props {}

export const AddColumnBtn: FC<Props> = ({}) => {
  return (
    <Box toCenter square-36 borderBottom borderRight borderTop>
      <Popover placement="bottom">
        <PopoverTrigger asChild>
          <Box
            gray500
            cursorPointer
            w-100p
            h-100p
            toCenter
            bgNeutral100--hover
            transitionColors
          >
            <Plus size={20} />
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <Content />
        </PopoverContent>
      </Popover>
    </Box>
  )
}
