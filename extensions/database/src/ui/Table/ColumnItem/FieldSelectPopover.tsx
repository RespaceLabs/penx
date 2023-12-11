import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { Controller } from 'react-hook-form'
import { Box, FowerHTMLProps } from '@fower/react'
import { ChevronDown, RefreshCcw } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { FieldType } from '@penx/model-types'
import { FieldIcon } from '../../shared/FieldIcon'

const textMap: Record<string, string> = {
  [FieldType.Text]: 'Text',
  [FieldType.Number]: 'Number',
  [FieldType.Password]: 'Password',
  [FieldType.SingleSelect]: 'Single Select',
  [FieldType.CreatedAt]: 'Created At',
  [FieldType.UpdatedAt]: 'Updated At',
}

interface Props {
  value: FieldType
  onChange: (value: FieldType) => void
}

export const FieldSelectPopover = forwardRef<HTMLDivElement, Props>(
  function FieldSelectPopover({ value, onChange }, ref) {
    return (
      <Popover placement="bottom">
        <PopoverTrigger ref={ref} asChild>
          <Box toBetween toCenterY h-100p h-32 border rounded px3 textSM>
            <Box>{textMap[value]}</Box>
            <Box gray500>
              <ChevronDown size={16} />
            </Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          bgGray800--T20--dark
          gray600
          minW-180
          cursorPointer
          textXS
        >
          {({ close }) => (
            <>
              {Object.entries(FieldType)
                .filter(([_, value]) =>
                  [
                    FieldType.Text,
                    FieldType.Number,
                    FieldType.Password,
                  ].includes(value),
                )
                .map(([key, value]) => (
                  <Item
                    fieldType={FieldType.Text}
                    key={key}
                    onClick={() => {
                      onChange(value)
                      close()
                    }}
                  >
                    <FieldIcon fieldType={key as any} />
                    <Box>{textMap[key]}</Box>
                  </Item>
                ))}
            </>
          )}
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
