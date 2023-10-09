import React, { FC, useEffect, useMemo, useState } from 'react'
import { Portal } from '@bone-ui/portal'
import { forwardRef } from '@bone-ui/utils'
import { Box } from '@fower/react'
import { AnimatePresence } from 'framer-motion'
import { DrawerProvider } from './drawerContext'
import { emitter, Events } from './emitter'
import { DrawerContext, DrawerProps, DrawerState } from './types'

export const Drawer: FC<DrawerProps> = forwardRef(function Drawer(
  props: DrawerProps,
  ref,
) {
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

  const [state, setState] = useState<DrawerState>({
    isOpen: !!isOpenProp,
    data: undefined,
  })

  const ctxValue: DrawerContext = useMemo(
    () => ({
      state,
      setState,
      open(data) {
        setState((prev) => ({ ...prev, isOpen: true, data }))
        onOpen?.()
      },
      close() {
        setState((prev) => ({ ...prev, isOpen: false }))
        onClose?.()
      },

      setData(data) {
        setState((prev) => ({ ...prev, data }))
      },
    }),
    [],
  )

  useEffect(() => {
    function handleOpen(e: Events['open']) {
      if (e.name === props.name) {
        ctxValue.open(e.data)
      }
    }

    function handleClose(e: Events['open']) {
      if (e.name === props.name) {
        ctxValue.close()
      }
    }

    emitter.on('open', handleOpen)
    emitter.on('close', handleClose)
    return () => {
      emitter.off('open', handleOpen)
      emitter.off('close', handleClose)
    }
  }, [props.name, ctxValue])

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
