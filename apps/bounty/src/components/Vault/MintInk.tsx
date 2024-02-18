import React from 'react'
import { Box } from '@fower/react'
import { readContract } from '@wagmi/core'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Button } from 'uikit'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap, wagmiConfig } from '@penx/wagmi'

const MintInk = () => {
  const vaultAddress = addressMap.DaoVault
  const { address } = useAccount()
  const { writeContractAsync, writeContract } = useWriteContract()
  return (
    <Box>
      <Button
        onClick={async () => {
          const amount = precision.token(10_000)
          try {
            await writeContractAsync({
              address: addressMap.INK,
              abi: erc20Abi,
              functionName: 'increaseAllowance',
              args: [address!, amount],
            })

            // const allowance = await readContract(wagmiConfig, {
            //   address: addressMap.INK,
            //   abi: erc20Abi,
            //   functionName: 'allowance',
            //   args: [address!, vaultAddress],
            // })

            await writeContractAsync({
              address: addressMap.INK,
              abi: erc20Abi,

              functionName: 'transferFrom',
              args: [address!, vaultAddress, amount],
            })
          } catch (error) {
            //
          }
        }}
      >
        Mint Ink
      </Button>
    </Box>
  )
}

export default MintInk
