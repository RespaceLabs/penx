import React, { FC, forwardRef, HTMLAttributes, PropsWithChildren } from 'react'
import { Controller } from 'react-hook-form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FieldType } from '@/lib/model'
import { ChevronDown, RefreshCcw } from 'lucide-react'
import { FieldIcon } from '../../shared/FieldIcon'

const textMap: Record<string, string> = {
  [FieldType.TEXT]: 'Text',
  [FieldType.NUMBER]: 'Number',
  [FieldType.PASSWORD]: 'Password',
  [FieldType.URL]: 'URL',
  [FieldType.SINGLE_SELECT]: 'Single select',
  [FieldType.MULTIPLE_SELECT]: 'Multiple select',
  [FieldType.CREATED_AT]: 'Created At',
  [FieldType.UPDATED_AT]: 'Updated At',
}

interface Props {
  value: FieldType
  onChange: (value: FieldType) => void
}

export const FieldSelectPopover = forwardRef<HTMLDivElement, Props>(
  function FieldSelectPopover({ value, onChange }, ref) {
    return (
      <Popover>
        <PopoverTrigger ref={ref as any} asChild>
          <div className="flex items-center justify-between border rounded px-3 text-sm h-8">
            <div>{textMap[value]}</div>
            <div className="text-foreground/50">
              <ChevronDown size={16} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <>
            {Object.entries(FieldType)
              .filter(([_, value]) =>
                [
                  FieldType.TEXT,
                  FieldType.NUMBER,
                  FieldType.PASSWORD,
                  FieldType.URL,
                  FieldType.SINGLE_SELECT,
                  FieldType.MULTIPLE_SELECT,
                ].includes(value),
              )
              .map(([key, value]) => (
                <Item
                  fieldType={FieldType.TEXT}
                  key={key}
                  onClick={() => {
                    onChange(value)
                    // close()
                  }}
                >
                  <FieldIcon fieldType={key as any} />
                  <div>{textMap[key]}</div>
                </Item>
              ))}
          </>
        </PopoverContent>
      </Popover>
    )
  },
)

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  fieldType: FieldType
}

function Item({ children, fieldType, ...rest }: ItemProps) {
  return (
    <div
      className="flex items-center text-sm text-foreground/80 gap-2 cursor-pointer hover:bg-foreground/5 rounded px-2 py-2"
      {...rest}
    >
      {children}
    </div>
  )
}
