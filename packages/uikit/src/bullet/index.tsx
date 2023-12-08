import { useMemo } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'

interface Props extends FowerHTMLProps<'div'> {
  size?: number
  innerSize?: number
  innerColor?: string
  outlineColor?: string
  dashed?: boolean
}

export function Bullet({
  size = 16,
  innerSize = 6,
  innerColor = 'gray500',
  outlineColor,
  dashed = false,
  ...rest
}: Props) {
  const color = useMemo(() => {
    if (outlineColor) return outlineColor
    return `${innerColor}--T80`
  }, [outlineColor, innerColor])
  return (
    <Box
      className="bulletIcon"
      square={size}
      bgTransparent
      bg={color}
      toCenter
      roundedFull
      cursorPointer
      // flexShrink-0
      border
      borderColor={dashed ? `${innerColor}--T80` : 'transparent'}
      borderDashed
      {...rest}
    >
      <Box
        square={innerSize}
        bg={innerColor}
        roundedFull
        transitionCommon
        scale-130--$bulletIcon--hover
      />
    </Box>
  )
}
