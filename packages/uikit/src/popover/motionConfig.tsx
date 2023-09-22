import { Placement } from '@floating-ui/react'
import { HTMLMotionProps, Variant } from 'framer-motion'

export type MotionVariants<T extends string> = Record<T, Variant>

type ScaleMotionVariant = MotionVariants<'enter' | 'exit'>

function getOrigin(placement: Placement) {
  const maps = {
    top: {
      originX: 0.5,
      originY: 1,
    },
    right: {
      originX: 0,
      originY: 0.5,
    },
    bottom: {
      originX: 0.5,
      originY: 0,
    },
    left: {
      originX: 1,
      originY: 0.5,
    },
    'bottom-end': {
      originX: 1,
      originY: 0,
    },
    'bottom-start': {
      originX: 0,
      originY: 0,
    },
    'left-end': {
      originX: 1,
      originY: 1,
    },
    'left-start': {
      originX: 1,
      originY: 0,
    },
    'right-end': {
      originX: 0,
      originY: 1,
    },
    'right-start': {
      originX: 0,
      originY: 0,
    },
    'top-end': {
      originX: 1,
      originY: 1,
    },
    'top-start': {
      originX: 0,
      originY: 1,
    },
  }

  return maps[placement]
}

export function getMotionConfig(animation: boolean, placement: Placement) {
  if (!animation) return {}
  const variants: ScaleMotionVariant = {
    exit: {
      opacity: 0,
      scale: 0.8,
      // y: -40,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 1, 1],
      },
    },
    enter: {
      scale: 1,
      opacity: 1,
      // y: 0,
      ...getOrigin(placement),
      transition: {
        duration: 0.1,
        ease: [0, 0, 0.2, 1],
      },
    },
  }

  const motionConfig: HTMLMotionProps<any> = {
    initial: 'exit',
    animate: 'enter',
    exit: 'exit',
    variants,
  }
  return motionConfig
}
