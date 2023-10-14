import React, { FC, PropsWithChildren } from 'react'
import { fadeConfig } from '@bone-ui/motion-configs'
import { Portal } from '@bone-ui/portal'
import { forwardRef } from '@bone-ui/utils'
import { styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Z_INDEX } from '../constants'
import { useModalContext } from '../modalContext'
import { ModalOverlayProps } from '../types'

const AnimatedDiv = styled(motion.div)

export const ModalOverlay: FC<PropsWithChildren<ModalOverlayProps>> =
  forwardRef((props: PropsWithChildren<ModalOverlayProps>, ref) => {
    const { children, ...rest } = props
    const { state } = useModalContext()

    return (
      <Portal>
        <AnimatePresence>
          {state.isOpen && (
            <AnimatedDiv
              ref={ref}
              className="bone-modal-overlay"
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
