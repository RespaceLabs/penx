import { HTMLMotionProps, Variant } from 'framer-motion'

type MotionVariants<T extends string> = Record<T, Variant>

type ScaleMotionVariant = MotionVariants<'enter' | 'exit'>

const variants: ScaleMotionVariant = {
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
      easings: 'easeout',
    },
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export const scaleConfig: HTMLMotionProps<any> = {
  initial: 'exit',
  animate: 'enter',
  exit: 'exit',
  variants,
}
