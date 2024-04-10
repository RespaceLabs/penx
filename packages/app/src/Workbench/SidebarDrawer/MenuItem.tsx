import { ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

interface MenuItemProps extends FowerHTMLProps<'div'> {
  label: ReactNode
  icon: ReactNode
  isActive?: boolean
  children?: ReactNode
  onClick: () => void
}

export const MenuItem = ({
  icon,
  label,
  isActive,
  onClick,
  children,
  ...rest
}: MenuItemProps) => {
  return (
    <Box
      toCenterY
      toBetween
      gap2
      px2
      h10
      black
      brand500={isActive}
      bgGray200--hover
      bgGray200--active
      transitionCommon
      cursorPointer
      // borderBottom
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
