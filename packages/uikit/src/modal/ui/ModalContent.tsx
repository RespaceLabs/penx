import React, { FC, forwardRef, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { useMediaQuery } from 'react-responsive'
import { Box, styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Portal } from '../../portal'
import { Z_INDEX } from '../constants'
import { useModalContext } from '../modalContext'
import { scaleConfig } from '../scaleConfig'
import { slideConfig } from '../slideConfig'
import { ModalContentProps } from '../types'

const AnimatedDiv = styled(motion.div)

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent(props, ref) {
    const { children, ...rest } = props
    const ctx = useModalContext()
    const { close, closeOnOverlayClick, state } = ctx
    const isMobile = useMediaQuery({ query: '(max-width: 560px)' })
    const variants = isMobile ? slideConfig : scaleConfig
    const [overlayTrigger, setOverlayTrigger] = useState<boolean>(false)
    return (
      <AnimatePresence>
        {state.isOpen && (
          <Portal>
            <Box
              ref={ref}
              onTouchStart={() => {
                setOverlayTrigger(true)
              }}
              onTouchEnd={() => {
                setOverlayTrigger(false)
              }}
              onMouseDown={() => {
                setOverlayTrigger(true)
              }}
              onMouseUp={() => {
                if (closeOnOverlayClick && overlayTrigger) {
                  setOverlayTrigger(false)
                  close()
                }
              }}
              fixed
              w-100p
              h-100p
              top0
              left0
              zIndex={Z_INDEX + 1}
            >
              <Box w-100p h-100p toCenter bgTransparent>
                <RemoveScroll>
                  <AnimatedDiv
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="uikit-modal-content"
                    roundedTop-20
                    roundedBottom={[0, 20]}
                    black
                    position={['absolute', 'relative']}
                    bottom={[0, 'auto']}
                    right={[0, 'auto']}
                    left={[0, 'auto']}
                    overflowYAuto
                    bgWhite
                    bg--dark="#1d1d1f"
                    px={[16, 32]}
                    py={[16, 32]}
                    // border-1
                    // borderGray200
                    // borderNone--dark
                    maxH={['100vh', '80vh']}
                    w={['100%', 460]}
                    shadowLG
                    shadow--dark="0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)"
                    // style={{ transformOrigin: 'center center' }}
                    {...variants}
                    {...(rest as any)}
                  >
                    {children}
                  </AnimatedDiv>
                </RemoveScroll>
              </Box>
            </Box>
          </Portal>
        )}
      </AnimatePresence>
    )
  },
)
