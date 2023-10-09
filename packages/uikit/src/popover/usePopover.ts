import { useCallback, useMemo, useState } from 'react'
import {
  autoUpdate,
  flip,
  offset,
  OffsetOptions,
  Placement,
  shift,
  useClick,
  // useHover,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import '@floating-ui/react-dom'

export interface PopoverOptions {
  isLazy?: boolean

  isDisabled?: boolean

  initialOpened?: boolean

  placement?: Placement

  offset?: OffsetOptions

  portal?: boolean

  modal?: boolean

  isOpen?: boolean

  onOpenChange?: (open: boolean) => void

  autoClose?: boolean

  showMask?: boolean

  trigger?: 'click' | 'hover' | 'manual'

  onClose?(): void

  onOpen?(): void
}

export function usePopover({
  initialOpened = false,
  placement = 'bottom',
  offset: offsetProp = { mainAxis: 4 },
  modal = true,
  portal = true,
  isOpen: controlledOpen,
  onOpenChange: setControlledOpen,
  onClose,
  onOpen,
  isDisabled,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpened)

  const [labelId, setLabelId] = useState<string | undefined>()

  const [descriptionId, setDescriptionId] = useState<string | undefined>()

  const [triggerWidth, setTriggerWidth] = useState<string | null>(null)

  const isOpen = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetProp), flip(), shift()],
  })

  const context = data.context

  const click = useClick(context, {
    enabled: controlledOpen == null,
  })

  // const hover = useHover(context, {
  //   enabled: controlledOpen == null,
  // })

  const dismiss = useDismiss(context)

  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([click, dismiss, role])

  const open = useCallback(() => {
    setOpen(true)
    onOpen?.()
  }, [setOpen, onOpen])

  const close = useCallback(() => {
    setOpen(false)
    onClose?.()
  }, [setOpen, onClose])

  return useMemo(
    () => ({
      isDisabled,

      isOpen,
      setOpen,

      close,
      open,

      ...interactions,
      ...data,
      modal,
      portal,

      labelId,
      setLabelId,

      descriptionId,
      setDescriptionId,

      triggerWidth,
      setTriggerWidth,
    }),
    [
      isOpen,
      setOpen,
      interactions,
      data,
      portal,
      modal,
      labelId,
      descriptionId,
      close,
      open,
      isDisabled,
      triggerWidth,
    ],
  )
}
