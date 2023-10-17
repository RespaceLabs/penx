import { ReactNode } from 'react'
import { Box } from '@fower/react'

interface SidebarItemProps {
  label: ReactNode
  icon: ReactNode
  count?: ReactNode
  onClick: () => void
}

export const SidebarItem = ({
  icon,
  count,
  label,
  onClick,
}: SidebarItemProps) => {
  return (
    <Box
      toCenterY
      toBetween
      gap2
      bgWhite
      rounded2XL
      px2
      py3
      cursorPointer
      onClick={onClick}
    >
      <Box toCenterY gap2>
        <Box inlineFlex gray500>
          {icon}
        </Box>
        <Box fontSemibold textLG>
          {label}
        </Box>
      </Box>
      <Box gray500 roundedFull textXS>
        {count}
      </Box>
    </Box>
  )
}
