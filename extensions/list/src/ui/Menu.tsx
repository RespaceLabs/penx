import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react'
import { Box, FowerHTMLProps } from '@fower/react'
import mitt from 'mitt'

export type Events = {
  show: { id: string; event: React.MouseEvent<HTMLDivElement, MouseEvent> }
}

export const emitter = mitt<Events>()

export function useContextMenu(id: string) {
  return {
    show(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      event.preventDefault()
      emitter.emit('show', { id, event })
    },
  }
}

interface MenuItemProps extends FowerHTMLProps<'div'> {
  disabled?: boolean
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  function MenuItem({ children, disabled, ...props }, ref) {
    return (
      <Box
        {...props}
        className="MenuItem"
        ref={ref}
        role="menuitem"
        disabled={disabled}
        px3
        toCenterY
        outlineNone
        h-36
        cursorPointer
      >
        {children}
      </Box>
    )
  },
)

interface Props {
  label?: string
  nested?: boolean
}

export const Menu = forwardRef<
  HTMLButtonElement,
  Props & React.HTMLProps<HTMLButtonElement>
>(function Menu({ children, id }, forwardedRef) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([])
  const listContentRef = useRef(
    Children.map(children, (child) =>
      isValidElement(child) ? child.props.label : null,
    ) as Array<string | null>,
  )
  const allowMouseUpCloseRef = useRef(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ['left-start'],
      }),
      shift({ padding: 10 }),
    ],
    placement: 'right-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  })

  const role = useRole(context, { role: 'menu' })
  const dismiss = useDismiss(context)
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex,
  })
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex,
  })

  const { getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNavigation,
    typeahead,
  ])

  useEffect(() => {
    let timeout: number
    function onContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      e.preventDefault()

      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          }
        },
      })

      setIsOpen(true)
      clearTimeout(timeout)

      allowMouseUpCloseRef.current = false
      timeout = window.setTimeout(() => {
        allowMouseUpCloseRef.current = true
      }, 300)
    }

    function handle(data: Events['show']) {
      if (id === data.id) {
        onContextMenu(data.event)
      }
    }

    emitter.on('show', handle)

    return () => {
      emitter.off('show', handle)
      clearTimeout(timeout)
    }
  }, [id, refs])

  // TODO:
  useEffect(() => {
    function onMouseUp(e: any) {
      if (allowMouseUpCloseRef.current) {
        // console.log('e:', e)
        // setIsOpen(false)
      }
    }
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [refs])

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingOverlay lockScroll>
          <FloatingFocusManager context={context} initialFocus={refs.floating}>
            <Box
              shadowPopover
              roundedLG
              textSM
              w-200
              bgWhite
              overflowHidden
              outlineNone
              zIndex-100
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              {Children.map(
                children,
                (child, index) =>
                  isValidElement(child) &&
                  cloneElement(
                    child,
                    getItemProps({
                      tabIndex: activeIndex === index ? 0 : -1,
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node
                      },
                      onClick() {
                        child.props.onClick?.()
                        setIsOpen(false)
                      },
                      onMouseUp() {
                        child.props.onClick?.()
                        setIsOpen(false)
                      },
                    }),
                  ),
              )}
            </Box>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  )
})
