'use client'

import React, { FC, PropsWithChildren, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FieldType } from '@/lib/types'
import { useDatabaseContext } from '../../DatabaseProvider'
import { FieldIcon } from '../../shared/FieldIcon'

interface PopoverStateProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
interface ItemProps extends PopoverStateProps {
  fieldType: FieldType
}

function Item({
  children,
  setIsOpen,
  fieldType,
  ...rest
}: PropsWithChildren<ItemProps>) {
  const ctx = useDatabaseContext()
  async function addColumn() {
    await ctx.addColumn(fieldType)
    setIsOpen(false)
    // close()
  }

  return (
    <div
      className="flex items-center text-sm text-foreground/80 gap-2 cursor-pointer hover:bg-foreground/10 rounded px-2 py-2"
      {...rest}
      onClick={addColumn}
    >
      {children}
    </div>
  )
}

function Content({ setIsOpen }: PopoverStateProps) {
  return (
    <div className="p-2">
      <Item fieldType={FieldType.TEXT} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.TEXT} />
        <div>Text</div>
      </Item>
      <Item fieldType={FieldType.NUMBER} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.NUMBER} />
        <div>Number</div>
      </Item>

      <Item fieldType={FieldType.URL} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.URL} />
        <div>URL</div>
      </Item>

      <Item fieldType={FieldType.PASSWORD} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.PASSWORD} />
        <div>Password</div>
      </Item>

      <Item fieldType={FieldType.SINGLE_SELECT} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.SINGLE_SELECT} />
        <div>Single Select</div>
      </Item>

      <Item fieldType={FieldType.MULTIPLE_SELECT} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.MULTIPLE_SELECT} />
        <div>Multiple Select</div>
      </Item>

      <Item fieldType={FieldType.RATE} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.SINGLE_SELECT} />
        <div>RATE</div>
      </Item>

      {/* <Item fieldType={FieldType.MARKDOWN} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.MARKDOWN} />
        <div>Markdown</div>
      </Item> */}

      <Item fieldType={FieldType.DATE} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.DATE} />
        <div>Date</div>
      </Item>

      <Item fieldType={FieldType.CREATED_AT} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.CREATED_AT} />
        <div>Created At</div>
      </Item>

      <Item fieldType={FieldType.UPDATED_AT} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.UPDATED_AT} />
        <div>Updated At</div>
      </Item>
    </div>
  )
}

interface Props {}

export const AddColumnBtn: FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex items-center justify-center w-9 h-9">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="text-foreground/50 cursor-pointer w-full h-full flex items-center justify-between">
            <Plus size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Content setIsOpen={setIsOpen} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
