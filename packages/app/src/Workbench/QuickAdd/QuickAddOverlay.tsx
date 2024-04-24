import { styled } from '@fower/react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeConfig } from 'uikit'
import { useQuickAdd } from '@penx/hooks'

const AnimatedDiv = styled(motion.div)

interface Props {
  colorName: string
}
export function QuickAddOverlay({ colorName }: Props) {
  const { isOpen } = useQuickAdd()

  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedDiv
          className="uikit-modal-overlay"
          fixed
          w-100p
          h-100p
          top0
          left0
          // bgBlack--T70
          bg={colorName}
          // bgWhite--T20
          // bgBlack--T50--dark
          zIndex={1000}
          style={
            {
              // backdropFilter: 'blur(5px)',
            }
          }
          {...(fadeConfig as any)}
        />
      )}
    </AnimatePresence>
  )
}
