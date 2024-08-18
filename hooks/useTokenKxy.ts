import { spaceAbi } from '@/lib/abi'
import { wagmiConfig } from '@/lib/wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { atom, useAtom } from 'jotai'
import { Address } from 'viem'

interface IKxy {
  k: bigint
  x: bigint
  y: bigint
}

const tokenKxyAtom = atom<IKxy>({
  k: BigInt(0),
  x: BigInt(0),
  y: BigInt(0),
})

const FEE_RATE = BigInt(1)

export function useTokenKxy() {
  const [tokenKxy, setTokenKxy] = useAtom(tokenKxyAtom)

  const updateTokenKxy = async (spaceAddress: Address) => {
    try {
      const { x, y, k } = await readContract(wagmiConfig, {
        address: spaceAddress,
        abi: spaceAbi,
        functionName: 'getSpaceInfo',
      })

      setTokenKxy({ k, x, y })
    } catch (error) {
      console.error('Failed to update kxy values:', error)
    }
  }

  function getBuyTokenAmount(ethAmount: bigint): bigint {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = tokenKxy.x + ethAmountAfterFee
    const newY = tokenKxy.k / newX
    const tokenAmount = tokenKxy.y - newY

    return tokenAmount
  }

  function getSellEthAmount(tokenAmount: bigint): bigint {
    const fee = (tokenAmount * FEE_RATE) / BigInt(100)
    const tokenAmountAfterFee = tokenAmount - fee
    const newY = tokenKxy.y + tokenAmountAfterFee
    const newX = tokenKxy.k / newY
    const ethAmount = tokenKxy.x - newX

    return ethAmount
  }

  const getTokenKxy = (): IKxy => {
    return tokenKxy
  }

  return { getBuyTokenAmount, getTokenKxy, updateTokenKxy, getSellEthAmount }
}
