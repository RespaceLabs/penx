import { Box, FowerHTMLProps } from '@fower/react'
import { IconLogo } from '@penx/icons'

interface Props extends FowerHTMLProps<'div'> {
  size?: number
  showText?: boolean
  stroke?: number | string
}

export const Logo = ({
  showText = true,
  size = 32,
  stroke = 2,
  ...rest
}: Props) => {
  const content = (
    <>
      {/* <Box
        as="img"
        src={`${BASE_URL || ''}/images/logo-512.png`}
        square={size * 0.9}
      /> */}
      <IconLogo size={size * 0.9} />

      {showText && (
        <Box>
          <Box text={size} fontBold toCenterY>
            <Box>Pen</Box>
            <Box brand500>X</Box>
          </Box>
        </Box>
      )}
    </>
  )
  return (
    <Box toCenterY gray800--hover black gapX1 {...rest}>
      {content}
    </Box>
  )
}
