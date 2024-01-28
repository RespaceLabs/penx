import { Box } from '@fower/react'
import { Button } from 'uikit'
import { erc20Abi, penxPointAbi } from '@penx/abi'
import { precision } from '@penx/math'
import {
  addressMap,
  useAccount,
  useReadContract,
  useWriteContract,
  writeContract,
} from '@penx/wagmi'

export function MintPointButton() {
  const { address } = useAccount()
  const { writeContract, isError, error } = useWriteContract()

  return (
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
  )
}
