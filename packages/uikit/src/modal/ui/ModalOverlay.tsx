import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeConfig } from '../../motion-configs'
import { Portal } from '../../portal'
import { Z_INDEX } from '../constants'
import { useModalContext } from '../modalContext'
import { ModalOverlayProps } from '../types'

const AnimatedDiv = styled(motion.div)

export const ModalOverlay = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ModalOverlayProps>
>(function ModalOverlay(props, ref) {
  const { children, ...rest } = props
  const { state } = useModalContext()

  return (
    <Portal>
      <AnimatePresence>
        {state.isOpen && (
          <AnimatedDiv
            ref={ref}
            className="uikit-modal-overlay"
            fixed
            w-100p
            h-100p
            top0
            left0
            bgBlack--T70
            // bgWhite--T20
            // bgBlack--T50--dark
            zIndex={Z_INDEX}
            style={
              {
                // backdropFilter: 'blur(5px)',
              }
            }
            {...(fadeConfig as any)}
            {...rest}
          />
        )}
      </AnimatePresence>
    </Portal>
  )
})
