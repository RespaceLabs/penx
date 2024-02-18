import React from 'react'
import { Box } from '@fower/react'
import { readContract } from '@wagmi/core'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { Button } from 'uikit'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap, wagmiConfig } from '@penx/wagmi'

const MintUSDT = () => {
  const vaultAddress = addressMap.DaoVault
  const { address } = useAccount()
  const { writeContractAsync, writeContract } = useWriteContract()
  const tokenAddress = addressMap.USDT
  return (
    <Box>
      <Button
        onClick={async () => {
          const amount = precision.token(10_000)

          await writeContractAsync({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'increaseAllowance',
            args: [address!, amount],
          })

          await writeContractAsync({
            address: tokenAddress,
            abi: erc20Abi,
            // functionName: 'transfer',
            // args: [addressMap.DaoVault, amount],
            functionName: 'transferFrom',
            args: [address!, vaultAddress, amount],
          })
        }}
      >
        Mint USDT
      </Button>
    </Box>
  )
}

export default MintUSDT
