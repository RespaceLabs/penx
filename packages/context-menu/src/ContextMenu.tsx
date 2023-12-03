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
import { emitter, Events } from './useContextMenu'

interface Props extends FowerHTMLProps<'div'> {
  label?: string
  nested?: boolean
}

export const ContextMenu = forwardRef<HTMLButtonElement, Props>(function Menu(
  { children, id, label, nested, ...rest },
  forwardedRef,
) {
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

    // TODO: should I use this? it block textField
    // typeahead,
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
      // console.log('up.....x')

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
            {...rest}
          >
            {Children.map(children, (child, index) => {
              if (!isValidElement(child)) return null

              return cloneElement(
                child,
                getItemProps({
                  tabIndex: activeIndex === index ? 0 : -1,
                  ref(node: HTMLButtonElement) {
                    listItemsRef.current[index] = node
                  },
                  onClick(e) {
                    // TODO:
                    // child.props.onClick?.(e)
                    // setIsOpen(false)
                  },
                  onMouseUp() {
                    if ((child.type as any)?.isMenuItem) {
                      child.props.onClick?.()
                      setIsOpen(false)
                    } else {
                      child.props.onMouseUp?.()
                    }
                  },
                }),
              )
            })}
          </Box>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  )
})
