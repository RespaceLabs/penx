import { Box, css, styled } from '@fower/react'
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  Variant,
} from 'framer-motion'
import { X } from 'lucide-react'
import { Button, fadeConfig } from 'uikit'
import { useQuickAdd } from '@penx/hooks'
import { getRandomColor } from '@penx/local-db'
import { QuickAddEditor } from './QuickAddEditor'
import { QuickAddOverlay } from './QuickAddOverlay'

export function QuickAdd() {
  const { isOpen, setIsOpen } = useQuickAdd()
  const color = getRandomColor()

  return (
    <Box>
      <QuickAddOverlay colorName={color} />
      <AnimatePresence initial={false}>
        {isOpen && (
          <Box zIndex-1001 fixed w-100p h-100p top0 left0 px4 pt4>
            <motion.div
              className={css({
                // h: 300,
                bgWhite: true,
                roundedLG: true,
                shadowXL: true,
                pb: 20,
              })}
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.3,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
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
              <QuickAddEditor colorName={color} />
            </motion.div>
            <Box toCenter white mt4>
              <Button
                isSquare
                roundedFull
                onClick={() => setIsOpen(false)}
                variant="light"
                colorScheme="white"
                borderNone
                shadowLG
              >
                <X></X>
              </Button>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  )
}
