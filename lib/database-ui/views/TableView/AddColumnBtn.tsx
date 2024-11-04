import React, { FC, PropsWithChildren } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDatabaseContext } from '@/lib/database-context'
import { FieldType } from '@/lib/model'
import { Plus } from 'lucide-react'
import { FieldIcon } from '../../shared/FieldIcon'

interface ItemProps extends PropsWithChildren {
  fieldType: FieldType
}

function Item({ children, fieldType, ...rest }: ItemProps) {
  const ctx = useDatabaseContext()
  async function addColumn() {
    await ctx.addColumn(fieldType)
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

function Content() {
  return (
    <div className="w-[200px] p-2">
      <Item fieldType={FieldType.TEXT}>
        <FieldIcon fieldType={FieldType.TEXT} />
        <div>Text</div>
      </Item>
      <Item fieldType={FieldType.NUMBER}>
        <FieldIcon fieldType={FieldType.NUMBER} />
        <div>Number</div>
      </Item>

      <Item fieldType={FieldType.URL}>
        <FieldIcon fieldType={FieldType.URL} />
        <div>URL</div>
      </Item>

      <Item fieldType={FieldType.PASSWORD}>
        <FieldIcon fieldType={FieldType.PASSWORD} />
        <div>Password</div>
      </Item>

      <Item fieldType={FieldType.SINGLE_SELECT}>
        <FieldIcon fieldType={FieldType.SINGLE_SELECT} />
        <div>Single Select</div>
      </Item>

      <Item fieldType={FieldType.MULTIPLE_SELECT}>
        <FieldIcon fieldType={FieldType.MULTIPLE_SELECT} />
        <div>Multiple Select</div>
      </Item>

      <Item fieldType={FieldType.RATE}>
        <FieldIcon fieldType={FieldType.SINGLE_SELECT} />
        <div>RATE</div>
      </Item>

      <Item fieldType={FieldType.MARKDOWN}>
        <FieldIcon fieldType={FieldType.MARKDOWN} />
        <div>Markdown</div>
      </Item>

      <Item fieldType={FieldType.DATE}>
        <FieldIcon fieldType={FieldType.DATE} />
        <div>Date</div>
      </Item>

      <Item fieldType={FieldType.CREATED_AT}>
        <FieldIcon fieldType={FieldType.CREATED_AT} />
        <div>Created At</div>
      </Item>

      <Item fieldType={FieldType.UPDATED_AT}>
        <FieldIcon fieldType={FieldType.UPDATED_AT} />
        <div>Updated At</div>
      </Item>
    </div>
  )
}

interface Props {}

export const AddColumnBtn: FC<Props> = ({}) => {
  return (
    <div className="flex items-center justify-center w-12 h-12">
      <Popover>
        <PopoverTrigger asChild>
          <div className="text-foreground/50 cursor-pointer w-full h-full flex items-center justify-center hover:bg-foreground/10 transition-colors">
            <Plus size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Content />
        </PopoverContent>
      </Popover>
    </div>
  )
}
