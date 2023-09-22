import React, { FC, useEffect, useState } from 'react'
import { Portal } from '@bone-ui/portal'
import { forwardRef } from '@bone-ui/utils'
import { Box } from '@fower/react'
import { AnimatePresence } from 'framer-motion'
import { DrawerProvider } from './drawerContext'
import { DrawerContext, DrawerProps, DrawerState } from './types'

export const Drawer: FC<DrawerProps> = forwardRef((props: DrawerProps, ref) => {
  const {
    children,
    isLazy,
    isOpen: isOpenProp,
    autoClose,
    portal,
    onClose,
    onOpen,
    ...rest
  } = props

  const [state, setState] = useState({ isOpen: isOpenProp } as DrawerState)

  const ctxValue: DrawerContext = {
    state,
    setState,
    open() {
      setState((prev) => ({
        ...prev,
        isOpen: true,
      }))
      onOpen?.()
    },
    close() {
      setState((prev) => ({
        ...prev,
        isOpen: false,
      }))
      onClose?.()
    },
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isOpen: isOpenProp!,
    }))
  }, [isOpenProp])

  return (
    <DrawerProvider value={ctxValue}>
      <Portal>
        <AnimatePresence>
          {state.isOpen && (
            <Box ref={ref} black className="bone-drawer" {...rest}>
              {children}
            </Box>
          )}
        </AnimatePresence>
      </Portal>
    </DrawerProvider>
  )
})
