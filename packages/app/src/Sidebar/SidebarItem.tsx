import { ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

interface SidebarItemProps extends FowerHTMLProps<'div'> {
  label: ReactNode
  icon: ReactNode
  children?: ReactNode
  onClick: () => void
}

export const SidebarItem = ({
  icon,
  label,
  onClick,
  children,
  ...rest
}: SidebarItemProps) => {
  return (
    <Box
      toCenterY
      toBetween
      gap2
      rounded2XL
      px2
      py-14
      cursorPointer
      black
      black--hover
      h-24
      {...rest}
      onClick={onClick}
    >
      <Box toCenterY gap2>
        <Box inlineFlex>{icon}</Box>
        <Box textSM>{label}</Box>
      </Box>
      {children}
    </Box>
  )
}
