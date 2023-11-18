import React, {
  cloneElement,
  FC,
  forwardRef,
  isValidElement,
  ReactNode,
  useMemo,
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import { Box, FowerHTMLProps } from '@fower/react'
import { useTooltipContext } from './context'

interface TooltipTriggerProps extends Omit<FowerHTMLProps<'div'>, 'children'> {
  children: ReactNode
  asChild?: boolean
}

export const TooltipTrigger = forwardRef<HTMLDivElement, TooltipTriggerProps>(
  function TooltipTrigger({ children, asChild = true, ...rest }, propRef) {
    const state = useTooltipContext()
    const childrenRef = (children as any).ref

    const ref = useMemo(
      () => mergeRefs([state.refs.setReference, propRef, childrenRef]),
      [state.refs.setReference, propRef, childrenRef],
    )

    const childrenElement = children

    let trigger = (
      <Box
        ref={ref}
        className="uikit-tooltip-trigger"
        cursorNotAllowed={!!state.isDisabled}
        inlineFlex
        data-state={state.isOpen ? 'opened' : 'closed'}
        {...state.getReferenceProps(rest as any)}
        {...rest}
      >
        {childrenElement}
      </Box>
    )

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && isValidElement(childrenElement)) {
      trigger = cloneElement(
        childrenElement,
        state.getReferenceProps({
          ref,
          ...(childrenElement.props as any),
          'data-state': state.isOpen ? 'opened' : 'closed',
        } as any),
      )
    }

    return trigger
  },
)
