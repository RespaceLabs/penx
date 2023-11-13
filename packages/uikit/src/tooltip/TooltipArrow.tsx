import React, { FC, forwardRef, useMemo } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { FloatingArrow } from '@floating-ui/react'
import { css, FowerHTMLProps } from '@fower/react'
import { useTooltipContext } from './context'

export interface TooltipArrowProps
  extends Omit<FowerHTMLProps<'div'>, 'children'> {
  width?: number
  height?: number
  tipRadius?: number
  staticOffset?: string | number | null
  d?: string
  stroke?: string
  strokeWidth?: number
}

export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>(
  function TooltipArrow(props, propRef) {
    const {
      width,
      height,
      tipRadius,
      staticOffset,
      d,
      stroke,
      strokeWidth,
      ...rest
    } = props
    const state = useTooltipContext()
    const ref = useMemo(
      () => mergeRefs([state.arrowRef, propRef]),
      [state.arrowRef, propRef],
    )

    const arrowProps = {
      width,
      height,
      tipRadius,
      staticOffset,
      d,
      stroke,
      strokeWidth,
    }

    return (
      <FloatingArrow
        ref={ref as any}
        context={state.context}
        {...arrowProps}
        className={css(rest)}
      />
    )
  },
)
