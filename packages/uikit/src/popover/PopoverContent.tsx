import React, { FC, forwardRef, ReactNode, useMemo } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react'
import { FowerHTMLProps, styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePopoverContext } from './context'
import { getMotionConfig } from './motionConfig'
import { PopoverRenderProps } from './types'

const AnimatedDiv = styled(motion.div)

export interface PopoverContentProps
  extends Omit<FowerHTMLProps<'div'>, 'children'> {
  /**
   * set width base trigger width
   */
  useTriggerWidth?: boolean

  animation?: boolean

  children: ((props: PopoverRenderProps) => ReactNode) | ReactNode
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(props, propRef) {
    const { children, animation = true, useTriggerWidth, ...rest } = props
    const state = usePopoverContext()

    const ref = useMemo(
      () => mergeRefs([state.refs.setFloating, propRef]),
      [state.refs.setFloating, propRef],
    )

    const { triggerWidth } = state

    const widthProps: any = {}
    if (triggerWidth && useTriggerWidth) {
      widthProps.w = triggerWidth
    }

    const content = (
      <FloatingFocusManager context={state.context} modal={state.modal}>
        <AnimatedDiv
          ref={ref}
          black
          shadow
          roundedXL
          shadowPopover
          outlineNone
          white--dark
          bgWhite
          bgGray800--dark
          zIndex={10000}
          overflowHidden
          style={{
            position: state.strategy,
            top: state.y ?? 0,
            left: state.x ?? 0,
            ...rest.style,
          }}
          aria-labelledby={state.labelId}
          aria-describedby={state.descriptionId}
          {...state.getFloatingProps(rest as any)}
          {...getMotionConfig(animation, state.placement)}
          {...widthProps}
        >
          {typeof children === 'function'
            ? (children as any)(state.getRenderProps())
            : children}
        </AnimatedDiv>
      </FloatingFocusManager>
    )

    if (state.portal) {
      return (
        <FloatingPortal>
          <AnimatePresence>{state.isOpen && content}</AnimatePresence>
        </FloatingPortal>
      )
    }

    return <AnimatePresence>{state.isOpen && content}</AnimatePresence>
  },
)
