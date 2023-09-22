import React, { FC, useContext } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { Portal } from '@bone-ui/portal'
import { forwardRef } from '@bone-ui/utils'
import { Box, styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Z_INDEX } from '../constants'
import { useModalContext } from '../modalContext'
import { scaleConfig } from '../scaleConfig'
import { ModalContentProps } from '../types'

const AnimatedDiv = styled(motion.div)

export const ModalContent: FC<ModalContentProps> = forwardRef(
  (props: ModalContentProps, ref) => {
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
                <RemoveScroll>
                  <AnimatedDiv
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="bone-modal-content"
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
