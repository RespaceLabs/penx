import { PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { ClientOnly } from '../../components/ClientOnly'
import { MintPointButton } from './MintPointButton'
import { MyPoint } from './MyPoint'

export function Web3Profile() {
  return <Profile />
}

export function Profile() {
  return (
    <Box p10 relative>
      <Box toBetween>
        <Box text2XL mb4 fontBold>
          Web3 profile
        </Box>
      </Box>

      <Box>
        {/* <MyPoint /> */}
        {/* <MintPointButton /> */}
      </Box>
    </Box>
  )
}
