import { Box } from '@fower/react'
import { useAccount } from 'wagmi'
import { Button, modalController } from 'uikit'
import { ModalNames } from '@penx/constants'
import { Logo } from '@penx/widget'
import { DisconnectButton } from '../DisconnectButton'
import { useReferralCode } from './hooks/useReferralCode'

function ReferralButton() {
  const { data, isLoading } = useReferralCode()

  if (isLoading) return null

  return (
    <Button
      variant="outline"
      roundedFull
      onClick={() => {
        if (data) {
          modalController.open(ModalNames.MY_REFERRALS, data)
        } else {
          modalController.open(ModalNames.GENERATE_REFERRAL_CODE)
        }
      }}
    >
      {!data ? 'Get referrals code' : 'My referrals'}
    </Button>
  )
}

export function BelieverNFTNav() {
  const { isConnected } = useAccount()
  return (
    <Box toBetween>
      <Logo></Logo>
      <Box toCenterY gap4>
        {isConnected && <ReferralButton />}
        <DisconnectButton />
      </Box>
    </Box>
  )
}
