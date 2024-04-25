import { Box, css, styled } from '@fower/react'
import { AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useQuickAdd } from '@penx/hooks'
import { MotionBox, MotionButton } from '@penx/widget'
import { setStatusBarColor } from '../../common/setStatusBarColor'
import { QuickAddEditor } from './QuickAddEditor'
import { QuickAddOverlay } from './QuickAddOverlay'

export function QuickAdd() {
  const { isOpen, setIsOpen, colorName } = useQuickAdd()
  return (
    <Box>
      <QuickAddOverlay />
      <AnimatePresence initial={false}>
        {isOpen && (
          <Box zIndex-1001 fixed w-100p h-100p top0 left0 px4 pt4>
            <MotionBox
              bgWhite
              roundedLG
              shadowXL
              pb-20
              relative
              initial={{
                opacity: 0,
                y: 50,
                originX: 0.5,
                originY: 0,
                scale: 0.3,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                originX: 0.5,
                originY: 0,
                transition: {
                  duration: 0.2,
                  easings: 'easein',
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                transition: {
                  duration: 0.2,
                  easings: 'easeout',
                },
              }}
            >
              <QuickAddEditor />

              <Box toCenter white mt4 absolute w-100p bottom--54>
                <MotionButton
                  isSquare
                  roundedFull
                  variant="light"
                  colorScheme="white"
                  borderNone
                  shadowLG
                  whileTap={{
                    scale: 1.2,
                  }}
                  onClick={() => {
                    setIsOpen(false)
                    setStatusBarColor('#ffffff')
                  }}
                >
                  <X></X>
                </MotionButton>
              </Box>
            </MotionBox>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  )
}
