import React, { FC, ReactNode } from 'react'
import { forwardRef } from '@bone-ui/utils'
import { css, FowerHTMLProps } from '@fower/react'
import { motion, Variant } from 'framer-motion'
import { usePopoverContext } from '../popover'
import ChevronDownOutline from './icons/ChevronDownOutline'

const variants: Record<'open' | 'closed', Variant> = {
  open: {
    rotate: -180,
    transition: {
      duration: 0.2,
    },
  },
  closed: {
    rotate: 0,
    transition: {
      duration: 0.2,
    },
  },
}

export interface SelectIconProps extends FowerHTMLProps<'div'> {
  size?: number
}

export const SelectIcon: FC<SelectIconProps> = forwardRef(
  (props: SelectIconProps, ref) => {
    const { children, size = 16, ...rest } = props
    const { isOpen } = usePopoverContext()

    let childrenElement: ReactNode = <ChevronDownOutline size={size} />

    if (children) {
      childrenElement = children
    }

    return (
      <motion.div
        ref={ref}
        className={css({ inlineFlex: true, ...rest })}
        variants={variants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        {childrenElement}
      </motion.div>
    )
  },
)
