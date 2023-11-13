import { HTMLMotionProps } from 'framer-motion'
import { easings, MotionVariants } from './easings'

type FadeMotionVariant = MotionVariants<'enter' | 'exit'>

const variants: FadeMotionVariant = {
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: easings.easeOut,
    },
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
}

export const fadeConfig: HTMLMotionProps<any> = {
  initial: 'exit',
  animate: 'enter',
  exit: 'exit',
  variants,
}
