import { Box, FowerHTMLProps } from '@fower/react'
import { Pen } from 'lucide-react'
import { StyledLink } from './StyledLink'

interface Props extends FowerHTMLProps<'div'> {
  size?: number
  to?: string
  showText?: boolean
  stroke?: number | string
}

export const Logo = ({
  showText = true,
  to,
  size = 32,
  stroke = 2,
  ...rest
}: Props) => {
  const content = (
    <>
      <Box as="img" src="/images/logo-512.png" square={size * 0.9} />

      {showText && (
        <Box>
          <Box text={size} black fontBold toCenterY>
            <Box>Pen</Box>
            <Box brand500>X</Box>
          </Box>
        </Box>
      )}
    </>
  )
  if (to) {
    return (
      <StyledLink href={to} toCenterY gray800--hover black {...(rest as any)}>
        {content}
      </StyledLink>
    )
  }
  return (
    <Box toCenterY gray800--hover black gap1 {...rest}>
      {content}
    </Box>
  )
}
