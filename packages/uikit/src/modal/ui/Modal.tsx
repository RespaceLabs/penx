import React, { FC, useEffect, useMemo, useState } from 'react'
import { emitter, Events } from '../emitter'
import { ModalProvider } from '../modalContext'
import { ModalContext, ModalProps, ModalState } from '../types'

export const Modal: FC<ModalProps> = (props) => {
  const {
    children,
    isLazy,
    isOpen: isOpenProp,
    closeOnOverlayClick = true,
    portal,
    onClose,
    onOpen,
    ...rest
  } = props

  const [state, setState] = useState<ModalState>({
    isOpen: !!isOpenProp,
    data: undefined,
  })

  const ctxValue: ModalContext = useMemo(
    () => ({
      data: state.data,
      state,
      closeOnOverlayClick,
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
    [state, closeOnOverlayClick, onOpen, onClose],
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

  return <ModalProvider value={ctxValue}>{children}</ModalProvider>
}
