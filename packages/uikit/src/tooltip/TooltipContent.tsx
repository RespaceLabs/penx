import React, { FC, forwardRef, ReactNode, useMemo } from 'react'
import { mergeRefs } from 'react-merge-refs'
import {
  FloatingPortal,
  useDelayGroup,
  useDelayGroupContext,
  useId,
  useTransitionStyles,
} from '@floating-ui/react'
import { Box, FowerHTMLProps } from '@fower/react'
import { useTooltipContext } from './context'

export interface TooltipContentProps
  extends Omit<FowerHTMLProps<'div'>, 'children'> {
  children: ReactNode
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function PopoverContent(props, propRef) {
    const { children, ...rest } = props
    const state = useTooltipContext()
    const id = useId()

    const ref = useMemo(
      () => mergeRefs([state.refs.setFloating, propRef]),
      [state.refs.setFloating, propRef],
    )

    const { isInstantPhase, currentId } = useDelayGroupContext()

    useDelayGroup(state.context, { id })
    const instantDuration = 0
    const duration = 250

    const { isMounted, styles } = useTransitionStyles(state.context, {
      duration: isInstantPhase
        ? {
            open: instantDuration,
            // `id` is this component's `id`
            // `currentId` is the current group's `id`
            close: currentId === id ? duration : instantDuration,
          }
        : duration,
      initial: {
        opacity: 0,
      },
    })

    return (
      <FloatingPortal>
        {isMounted && (
          <Box
            ref={ref}
            outlineNone
            shadowSM
            leadingNormal
            roundedLG
            maxW-400
            px3
            py2
            textXS
            zIndex-10000
            textSM
            bgBlack
            bgBlack--dark--i
            gray100
            gray100--dark
            zIndex={10000}
            style={{
              position: state.strategy,
              top: state.y ?? 0,
              left: state.x ?? 0,
              ...rest.style,
              visibility: state.x == null ? 'hidden' : 'visible',
              ...props.style,
              ...styles,
            }}
            aria-labelledby={state.labelId}
            aria-describedby={state.descriptionId}
            {...state.getFloatingProps()}
            {...rest}
          >
            {children}
          </Box>
        )}
      </FloatingPortal>
    )
  },
)
