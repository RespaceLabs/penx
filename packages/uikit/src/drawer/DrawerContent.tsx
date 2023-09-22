import React, { FC, useContext } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { CloseButton } from '@bone-ui/close-button'
import { forwardRef } from '@bone-ui/utils'
import { Box, styled } from '@fower/react'
import { motion } from 'framer-motion'
import { drawerContext } from './drawerContext'
import { slideConfig } from './slideConfig'
import { DrawerContentProps } from './types'

const AnimatedDiv = styled(motion.div)

export const DrawerContent: FC<DrawerContentProps> = forwardRef(
  (props: DrawerContentProps, ref) => {
    const { children, ...rest } = props
    const ctx = useContext(drawerContext)
    const { close } = ctx

    return (
      <Box
        ref={ref}
        onClick={() => {
          close()
        }}
        fixed
        w-100p
        h-100p
        top0
        left0
        bottom0
        zIndex-1001
      >
        <Box w-100p h-100p toRight bgTransparent>
          <RemoveScroll style={{ width: '100%' }}>
            <AnimatedDiv
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="bone-modal-content"
              shadow
              relative
              h-100p
              w-300
              overflowYAuto
              bgWhite
              bgGray800--dark
              transition={{ type: 'spring' }}
              {...slideConfig}
              {...(rest as any)}
            >
              <CloseButton onClick={close} absolute top-8 right-8 zIndex-1 />
              {children}
            </AnimatedDiv>
          </RemoveScroll>
        </Box>
      </Box>
    )
  },
)
