import React, { FC, PropsWithChildren } from 'react'
import { Box, styled } from '@fower/react'
import { CheckCircle2, Clock, Hash, Link, Plus, Text } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { db } from '@penx/local-db'
import { FieldType } from '@penx/types'
import { useDatabaseContext } from '../DatabaseContext'

const WrapIcon = styled('div', ['gray500'])

function Item({
  children,
  fieldType,
}: PropsWithChildren<{ fieldType: FieldType }>) {
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
      <Item fieldType={FieldType.Number}>
        <WrapIcon>
          <Hash size={16} />
        </WrapIcon>
        <Box>Number</Box>
      </Item>

      <Item fieldType={FieldType.SingleSelect}>
        <WrapIcon>
          <CheckCircle2 size={16} />
        </WrapIcon>
        <Box>Select</Box>
      </Item>

      <Item fieldType={FieldType.Text}>
        <WrapIcon>
          <Link size={16} />
        </WrapIcon>
        <Box>Link</Box>
      </Item>

      <Item fieldType={FieldType.Text}>
        <WrapIcon>
          <Clock size={16} />
        </WrapIcon>
        <Box>Created At</Box>
      </Item>

      <Item fieldType={FieldType.Text}>
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
