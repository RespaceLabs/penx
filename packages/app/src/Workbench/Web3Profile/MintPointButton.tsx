import { Box } from '@fower/react'
import { writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { Button } from 'uikit'
import { daoVaultAbi, erc20Abi, penxPointAbi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

export function MintPointButton() {
  const { address } = useAccount()

  return (
    <Box toCenterY gap2>
      <Button
        onClick={async () => {
          writeContract({
            address: addressMap.PenxPoint,
            abi: penxPointAbi,
            functionName: 'mint',
            args: [address!, precision.token(1)],
          })
        }}
      >
        Mint point
      </Button>

      <Button
        onClick={async () => {
          writeContract({
            address: addressMap.DaoVault,
            abi: daoVaultAbi,
            functionName: 'transferETH',
            args: [
              '0x54D2B96d7Ec85161fA47d96f58eABe365A2f8a51',
              precision.token(0.01),
            ],
          })
        }}
      >
        Transfer
      </Button>
    </Box>
  )
}
