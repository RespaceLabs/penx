import React, { FC, forwardRef } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { Box, css, styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Portal } from '../../portal'
import { Z_INDEX } from '../constants'
import { useModalContext } from '../modalContext'
import { scaleConfig } from '../scaleConfig'
import { ModalContentProps } from '../types'

const AnimatedDiv = styled(motion.div)

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContentProps(props, ref) {
    const { children, ...rest } = props
    const ctx = useModalContext()
    const { close, closeOnOverlayClick, state } = ctx

    return (
      <AnimatePresence>
        {state.isOpen && (
          <Portal>
            <Box
              ref={ref}
              onClick={() => {
                if (closeOnOverlayClick) close()
              }}
              fixed
              w-100p
              h-100p
              top0
              left0
              zIndex={Z_INDEX + 1}
            >
              <Box w-100p h-100p toCenter bgTransparent>
                <RemoveScroll className={css({ toCenter: true, w: '100%' })}>
                  <AnimatedDiv
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="uikit-modal-content"
                    rounded2XL
                    black
                    relative
                    overflowYAuto
                    bgWhite
                    bgGray800--dark
                    gray100--dark
                    p8
                    // border-1
                    // borderGray200
                    // borderNone--dark
                    maxH={['100vh', '80vh']}
                    w={['92vw', 460]}
                    shadowLG
                    shadow--dark="0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)"
                    // style={{ transformOrigin: 'center center' }}
                    {...scaleConfig}
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
