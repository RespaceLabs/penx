import { useCallback, useMemo, useRef, useState } from 'react'
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'

export interface HoverCardOptions {
  isDisabled?: boolean

  initialOpened?: boolean

  placement?: Placement

  offset?: number

  modal?: boolean

  isOpen?: boolean

  onOpenChange?: (open: boolean) => void
}

export function useHoverCard({
  initialOpened = false,
  placement = 'top',
  modal = true,
  offset: offsetSize = 8,
  isOpen: controlledOpen,
  onOpenChange: setControlledOpen,
  isDisabled,
}: HoverCardOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpened)

  const [labelId, setLabelId] = useState<string | undefined>()

  const [descriptionId, setDescriptionId] = useState<string | undefined>()

  const arrowRef = useRef(null)

  const isOpen = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const { delay } = useDelayGroupContext()

  const data = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetSize),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  })

  const context = data.context

  const hover = useHover(context, {
    enabled: controlledOpen == null,
    move: false,
    delay: delay || 200,
  })

  const dismiss = useDismiss(context)
  const focus = useFocus(context)
  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([hover, dismiss, role, focus])

  const open = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const close = useCallback(() => {
    setOpen(false)
  }, [setOpen])

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

      labelId,
      setLabelId,

      descriptionId,
      setDescriptionId,

      arrowRef,
    }),
    [
      isOpen,
      setOpen,
      interactions,
      data,
      modal,
      labelId,
      descriptionId,
      open,
      close,
      isDisabled,
    ],
  )
}
