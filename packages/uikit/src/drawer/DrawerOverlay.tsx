import React, { FC, useContext } from 'react'
import { fadeConfig } from '@bone-ui/motion-configs'
import { forwardRef } from '@bone-ui/utils'
import { styled } from '@fower/react'
import { motion } from 'framer-motion'
import { drawerContext } from './drawerContext'
import { DrawerOverlayProps } from './types'

const AnimatedDiv = styled(motion.div)

export const DrawerOverlay: FC<DrawerOverlayProps> = forwardRef(
  (props: DrawerOverlayProps, ref) => {
    const { children, ...rest } = props
    const ctx = useContext(drawerContext)
    const { close } = ctx
    return (
      <AnimatedDiv
        ref={ref}
        onClick={() => {
          close()
        }}
        className="bone-drawer-overlay"
        fixed
        w-100p
        h-100p
        top0
        left0
        bgBlack--T70
        bgBlack--T80--dark
        zIndex-1000
        {...(fadeConfig as any)}
        {...rest}
      />
    )
  },
)
