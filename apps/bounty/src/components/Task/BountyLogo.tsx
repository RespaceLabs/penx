import { Box, FowerHTMLProps } from '@fower/react'
import { Gem } from 'lucide-react'

interface Props extends Omit<FowerHTMLProps<'div'>, 'children'> {}

export const BountyLogo = (props: Props) => {
  return (
    <Box toCenterY gap2 {...props}>
      <Box toCenterY gap2>
        <Box white bgBlack square7 toCenter roundedFull>
          <Gem size={20}></Gem>
        </Box>
        <Box text2XL fontBold>
          PenX Bounty
        </Box>
      </Box>
    </Box>
  )
}
