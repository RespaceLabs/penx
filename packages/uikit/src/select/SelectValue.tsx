import React, {
  cloneElement,
  FC,
  forwardRef,
  isValidElement,
  ReactNode,
} from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useRadioGroupContext } from '../radio'
import { useSelectContext } from './context'

export interface SelectValueProps
  extends Omit<FowerHTMLProps<'div'>, 'placeholder'> {
  placeholder?: ReactNode
  asChild?: boolean
}

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue(props: SelectValueProps, ref) {
    const { asChild, placeholder, children, onClick, ...rest } = props
    const { selectedItem } = useSelectContext()
    const radioContext = useRadioGroupContext()

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ref,
        rest,
      } as any)
    }

    return (
      <Box as="span" ref={ref} leadingNormal toCenterY gap1 {...rest}>
        {!!selectedItem &&
          ((selectedItem as any)?.props?.children || radioContext.value)}
        {!selectedItem && placeholder}
      </Box>
    )
  },
)
