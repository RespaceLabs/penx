import React, {
  cloneElement,
  FC,
  isValidElement,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { forwardRef, mergeRefs } from '@bone-ui/utils'
import { Box, FowerHTMLProps } from '@fower/react'
import { isBrowser } from '@fower/utils'
import { usePopoverContext } from './context'
import { PopoverRenderProps } from './types'

interface PopoverTriggerProps extends Omit<FowerHTMLProps<'div'>, 'children'> {
  children: ((props: PopoverRenderProps) => ReactNode) | ReactNode
  asChild?: boolean
}

export const PopoverTrigger: FC<PopoverTriggerProps> = forwardRef(
  function PopoverTrigger(
    { children, asChild = true, ...rest }: PopoverTriggerProps,
    propRef,
  ) {
    const state = usePopoverContext()

    const childrenRef = (children as any).ref

    const { setTriggerWidth } = state

    const elementRef = useCallback(
      (element: HTMLElement) => {
        if (isBrowser && element) {
          const { width } = window.getComputedStyle(element)
          setTriggerWidth(width)
        }
      },
      [setTriggerWidth],
    )

    const ref = useMemo(
      () =>
        mergeRefs([state.refs.setReference, propRef, childrenRef, elementRef]),
      [state.refs.setReference, propRef, childrenRef, elementRef],
    )

    const childrenElement =
      typeof children === 'function'
        ? (children as any)(state.getRenderProps())
        : children

    let trigger = (
      <Box
        ref={ref}
        className="bone-popover-trigger"
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
