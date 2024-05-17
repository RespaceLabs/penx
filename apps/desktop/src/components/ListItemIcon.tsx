import SVG from 'react-inlinesvg'
import { Box, css } from '@fower/react'
import Image from 'next/image'

interface ListItemIconProps {
  icon: string
  size?: number
}

export function ListItemIcon({ icon, size = 20 }: ListItemIconProps) {
  if (!icon) {
    return <Box square={size} bgNeutral300 rounded-6></Box>
  }

  if (icon.startsWith('/')) {
    return (
      <Image
        src={icon}
        alt=""
        width={size}
        height={size}
        style={{ borderRadius: 6 }}
      />
    )
  }

  const isSVG = icon.startsWith('<svg')
  if (isSVG) {
    return (
      <SVG
        width={size}
        height={size}
        className={css({ rounded: 6 })}
        src={icon as string}
      />
    )
  }
  return (
    <Box
      as="img"
      square={size}
      rounded-6
      src={`data:image/png;base64, ${icon}`}
    />
  )
}
