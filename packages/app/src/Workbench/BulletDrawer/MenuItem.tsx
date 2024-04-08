import { ReactNode } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

interface MenuItemProps extends FowerHTMLProps<'div'> {
  label: ReactNode
  icon: ReactNode
  children?: ReactNode
  onClick: () => void
}

export const MenuItem = ({
  icon,
  label,
  onClick,
  children,
  ...rest
}: MenuItemProps) => {
  return (
    <Box
      toCenterY
      toBetween
      gap2
      black
      px3
      h11
      borderBottom-1
      bgGray200--hover
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
