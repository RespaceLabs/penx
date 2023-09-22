import React, { FC, useMemo } from 'react'
import { forwardRef, mergeRefs } from '@bone-ui/utils'
import { FloatingArrow } from '@floating-ui/react'
import { css, FowerHTMLProps } from '@fower/react'
import { useHoverCardContext } from './context'

export interface HoverCardArrowProps
  extends Omit<FowerHTMLProps<'div'>, 'children'> {
  width?: number
  height?: number
  tipRadius?: number
  staticOffset?: string | number | null
  d?: string
  stroke?: string
  strokeWidth?: number
}

export const HoverCardArrow: FC<HoverCardArrowProps> = forwardRef(
  function HoverCardArrow(props: HoverCardArrowProps, propRef) {
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
    const state = useHoverCardContext()
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
        ref={ref}
        context={state.context}
        {...arrowProps}
        className={css(rest)}
      />
    )
  },
)
