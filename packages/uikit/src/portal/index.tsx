import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Box, FowerHTMLProps } from '@fower/react'

export interface PortalProps extends FowerHTMLProps<'div'> {}

export const Portal: FC<PortalProps> = (props) => {
  const { children, className = '', ...rest } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (typeof document === 'undefined') return null

  return mounted
    ? createPortal(
        <Box className={`uikit-portal ${className}`.trimEnd()} {...rest}>
          {children}
        </Box>,
        document.body,
      )
    : null
}
