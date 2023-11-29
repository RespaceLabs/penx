import React, { FC, PropsWithChildren } from 'react'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import { CheckCircle2, Clock, Hash, Link, Plus, Text } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { FieldType } from '@penx/model-types'
import { useDatabaseContext } from '../DatabaseContext'

const WrapIcon = styled('div', ['gray500'])

interface ItemProps extends PropsWithChildren<FowerHTMLProps<'div'>> {
  fieldType: FieldType
}

function Item({ children, fieldType, ...rest }: ItemProps) {
  const { close } = usePopoverContext()
  const ctx = useDatabaseContext()
  async function addColumn() {
    if (fieldType === FieldType.Text) {
      console.log('========fieldType:', fieldType)
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
        <WrapIcon>
          <Text size={16} />
        </WrapIcon>
        <Box>Text</Box>
      </Item>
      <Item fieldType={FieldType.Number} cursorNotAllowed opacity-60>
        <WrapIcon>
          <Hash size={16} />
        </WrapIcon>
        <Box>Number</Box>
      </Item>

      <Item fieldType={FieldType.SingleSelect} cursorNotAllowed opacity-60>
        <WrapIcon>
          <CheckCircle2 size={16} />
        </WrapIcon>
        <Box>Select</Box>
      </Item>

      <Item fieldType={FieldType.Number} cursorNotAllowed opacity-60>
        <WrapIcon>
          <Link size={16} />
        </WrapIcon>
        <Box>Link</Box>
      </Item>

      <Item fieldType={FieldType.Number} cursorNotAllowed opacity-60>
        <WrapIcon>
          <Clock size={16} />
        </WrapIcon>
        <Box>Created At</Box>
      </Item>

      <Item fieldType={FieldType.UpdatedAt} cursorNotAllowed opacity-60>
        <WrapIcon>
          <Clock size={16} />
        </WrapIcon>
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
