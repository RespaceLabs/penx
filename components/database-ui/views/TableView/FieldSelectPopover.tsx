import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { ChevronDown, RefreshCcw } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FieldType } from '@/lib/types'
import { Box, FowerHTMLProps } from '@fower/react'
import { FieldIcon } from '../../shared/FieldIcon'
import { useFieldTypeSelectPopover } from './hooks/useFieldTypeSelectPopover'

const textMap: Record<string, string> = {
  [FieldType.TEXT]: 'Text',
  [FieldType.NUMBER]: 'Number',
  // [FieldType.PASSWORD]: 'Password',
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
    console.log('value==:', value)

    const { isOpen, setIsOpen } = useFieldTypeSelectPopover()
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger ref={ref as any} asChild>
          <Box toBetween toCenterY h-100p h-36 border rounded px3 textSM>
            <Box>{textMap[value]}</Box>
            <Box gray500>
              <ChevronDown size={16} />
            </Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-[180px] p-0"
          // bgGray800--T20--dark
          // gray600
          // minW-180
          // cursorPointer
          // textXS
        >
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
                  setIsOpen(false)
                }}
              >
                <FieldIcon fieldType={key as any} />
                <Box>{textMap[key]}</Box>
              </Item>
            ))}
        </PopoverContent>
      </Popover>
    )
  },
)

interface ItemProps extends PropsWithChildren<FowerHTMLProps<'div'>> {
  fieldType: FieldType
}

function Item({ children, fieldType, ...rest }: ItemProps) {
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
    >
      {children}
    </Box>
  )
}
