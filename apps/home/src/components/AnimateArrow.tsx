import React, { FC, forwardRef, ReactNode } from 'react'
import { css, FowerHTMLProps } from '@fower/react'
import { motion, Variant } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export interface SelectIconProps extends Omit<FowerHTMLProps<'div'>, 'rotate'> {
  isOpen: boolean
  rotate?: number | string
  duration?: number
}

export const AnimateArrow = forwardRef<HTMLDivElement, SelectIconProps>(
  function AnimateArrow(props, ref) {
    const { children, isOpen, rotate = 90, duration = 0.2, ...rest } = props

    const variants: Record<'open' | 'closed', Variant> = {
      open: { rotate, transition: { duration } },
      closed: { rotate: 0, transition: { duration } },
    }

    let childrenElement: ReactNode = <ChevronRight size={14} />

    if (children) {
      childrenElement = children
    }

    return (
      <motion.div
        ref={ref}
        className={css(rest)}
        variants={variants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        {childrenElement}
      </motion.div>
    )
  },
)
