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
import { useHoverCardContext } from './context'

interface HoverCardTriggerProps
  extends Omit<FowerHTMLProps<'div'>, 'children'> {
  children: ReactNode
  asChild?: boolean
}

export const HoverCardTrigger = forwardRef<
  HTMLDivElement,
  HoverCardTriggerProps
>(function HoverCardTrigger({ children, asChild = true, ...rest }, propRef) {
  const state = useHoverCardContext()
  const childrenRef = (children as any).ref

  const ref = useMemo(
    () => mergeRefs([state.refs.setReference, propRef, childrenRef]),
    [state.refs.setReference, propRef, childrenRef],
  )

  const childrenElement = children

  let trigger = (
    <Box
      ref={ref}
      className="uikit-hover-card-trigger"
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
})
