import { ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { HTMLMotionProps, motion } from 'framer-motion'
import { Button, ButtonProps } from 'uikit'

export const MotionButton: (
  props: HTMLMotionProps<'button'> & FowerHTMLProps<'button'> & ButtonProps,
) => ReactNode = motion(Button) as any

export const MotionBox: (
  props: HTMLMotionProps<'div'> & FowerHTMLProps<'div'> & ButtonProps,
) => ReactNode = motion(Box) as any
