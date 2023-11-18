import React, { FC, forwardRef, useContext } from 'react'
import { styled } from '@fower/react'
import { motion } from 'framer-motion'
import { fadeConfig } from '../motion-configs'
import { drawerContext } from './drawerContext'
import { DrawerOverlayProps } from './types'

const AnimatedDiv = styled(motion.div)

export const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(
  function DrawerOverlayProps(props, ref) {
    const { children, ...rest } = props
    const ctx = useContext(drawerContext)
    const { close } = ctx
    return (
      <AnimatedDiv
        ref={ref}
        onClick={() => {
          close()
        }}
        className="uikit-drawer-overlay"
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
