import React, { FC, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import {
  CheckCircle2,
  Clock,
  FileType,
  Hash,
  Link,
  Plus,
  Text,
} from 'lucide-react'
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
    if (
      [FieldType.Text, FieldType.Number, FieldType.Password].includes(fieldType)
    ) {
      await ctx.addColumn(fieldType)
      close()
    }
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
      <Item fieldType={FieldType.Text}>
        <FieldIcon fieldType={FieldType.Text} />
        <Box>Text</Box>
      </Item>
      <Item fieldType={FieldType.Number}>
        <FieldIcon fieldType={FieldType.Number} />
        <Box>Number</Box>
      </Item>

      <Item fieldType={FieldType.Password}>
        <FieldIcon fieldType={FieldType.Password} />
        <Box>Password</Box>
      </Item>

      <Item fieldType={FieldType.SingleSelect} cursorNotAllowed opacity-60>
        <FieldIcon fieldType={FieldType.SingleSelect} />
        <Box>Select</Box>
      </Item>

      <Item fieldType={FieldType.Number} cursorNotAllowed opacity-60>
        <FieldIcon fieldType={FieldType.CreatedAt} />
        <Box>Created At</Box>
      </Item>

      <Item fieldType={FieldType.UpdatedAt} cursorNotAllowed opacity-60>
        <FieldIcon fieldType={FieldType.UpdatedAt} />
        <Box>Updated At</Box>
      </Item>
    </Box>
  )
}

interface Props {}

export const AddColumnBtn: FC<Props> = ({}) => {
  return (
    <Box toCenter square-40 borderBottom borderRight borderTop>
      <Popover placement="bottom">
        <PopoverTrigger asChild>
          <Box gray500 cursorPointer w-100p h-100p toCenter>
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
