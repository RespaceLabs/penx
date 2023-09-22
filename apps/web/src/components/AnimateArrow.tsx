import React, { FC, ReactNode } from 'react'
import { ChevronRightOutline } from '@bone-ui/icons'
import { forwardRef } from '@bone-ui/utils'
import { css, FowerHTMLProps } from '@fower/react'
import { motion, Variant } from 'framer-motion'

export interface SelectIconProps extends Omit<FowerHTMLProps<'div'>, 'rotate'> {
  isOpen: boolean
  rotate?: number | string
  duration?: number
}

export const AnimateArrow: FC<SelectIconProps> = forwardRef(
  (props: SelectIconProps, ref) => {
    const { children, isOpen, rotate = 90, duration = 0.2, ...rest } = props

    const variants: Record<'open' | 'closed', Variant> = {
      open: { rotate, transition: { duration } },
      closed: { rotate: 0, transition: { duration } },
    }

    let childrenElement: ReactNode = (
      <ChevronRightOutline size={14} stroke="2" />
    )

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
