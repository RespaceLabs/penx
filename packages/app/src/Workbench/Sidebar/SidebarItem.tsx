import { ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

interface SidebarItemProps extends FowerHTMLProps<'div'> {
  label: ReactNode
  icon: ReactNode
  isActive?: boolean
  children?: ReactNode
  onClick: () => void
}

export const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
  children,
  ...rest
}: SidebarItemProps) => {
  return (
    <Box
      toCenterY
      toBetween
      gap2
      rounded
      px2
      black
      brand500={isActive}
      bgGray200--hover
      h8
      transitionCommon
      cursorPointer
      {...rest}
      onClick={onClick}
    >
      <Box toCenterY gap2>
        <Box inlineFlex>{icon}</Box>
        <Box textBase>{label}</Box>
      </Box>
      {children}
    </Box>
  )
}
