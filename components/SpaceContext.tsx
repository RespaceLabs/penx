'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import {
  editorDefaultValue,
  IPFS_GATEWAY,
  RESPACE_BASE_URI,
} from '@/lib/constants'
import { useQueryEthPrice } from '@/lib/hooks/useEthPrice'
import { precision } from '@/lib/math'
import { api } from '@/lib/trpc'
import { SpaceType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { Address } from 'viem'

export const FEE_RATE = BigInt(1) // 1%

export class Space {
  constructor(public raw: SpaceType) {}

  get x() {
    return BigInt(this.raw.x)
  }

  get y() {
    return BigInt(this.raw.y)
  }

  get k() {
    return BigInt(this.raw.k)
  }

  get id() {
    return this.raw.address
  }

  get name() {
    return this.raw.name
  }

  get totalSupply() {
    return this.raw.totalSupply
  }

  get totalSupplyDecimal() {
    return precision.toDecimal(this.totalSupply)
  }

  get totalSupplyFormatted() {
    return this.totalSupplyDecimal.toFixed(2)
  }

  get ethVolume() {
    return this.raw.ethVolume
  }

  get ethVolumeDetail() {
    return precision.toDecimal(this.ethVolume)
  }

  get ethVolumeFormatted() {
    return this.ethVolumeDetail.toFixed(4)
  }

  get memberCount() {
    return this.raw.memberCount
  }

  get stakingRevenuePercent() {
    return BigInt(this.raw.stakingRevenuePercent)
  }

  get subdomain() {
    return this.raw.subdomain || this.symbolName.toLowerCase()
  }

  get description() {
    return this.raw.description
  }

  get about() {
    return this.raw.about
  }

  get aboutJson() {
    try {
      return JSON.parse(this.raw.about)
    } catch (error) {
      return editorDefaultValue
    }
  }

  get symbolName() {
    return this.raw.symbol
  }

  get logo() {
    const { logo } = this.raw
    if (!logo) return ''
    if (logo.startsWith('http')) return logo
    return IPFS_GATEWAY + `/ipfs/${logo}`
  }

  get address() {
    return this.raw.address
  }

  get founder() {
    return this.raw.founder
  }

  get spaceInfo() {
    return {
      name: this.name,
      description: this.description,
      about: this.about,
      logo: this.logo.split('/').pop(),
      subdomain: this.raw.subdomain,
    }
  }

  isFounder(account: Address) {
    return this.raw.founder.toLowerCase() === account.toLowerCase()
  }

  getUsdVolume(ethPrice: number) {
    const usdVolume = this.ethVolumeDetail * ethPrice
    return {
      usdVolume,
      usdVolumeFormatted: '$' + usdVolume.toFixed(2),
    }
  }

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return tokenAmount
  }

  getEthAmount(tokenAmount: bigint) {
    const fee = (tokenAmount * FEE_RATE) / BigInt(100)
    const tokenAmountAfterFee = tokenAmount - fee
    const newY = this.y + tokenAmountAfterFee
    const newX = this.k / newY
    const ethAmount = this.x - newX
    return ethAmount
  }
}

export const SpaceContext = createContext({} as Space)

interface Props {}

export const SpaceProvider = ({ children }: PropsWithChildren<Props>) => {
  useQueryEthPrice()
  const { data: space, isLoading } = useQuery({
    queryKey: ['space'],
    queryFn: async () => {
      const site = await api.site.getSite.query()
      const response = await ky
        .get(RESPACE_BASE_URI + `/api/get-space?address=${site.id}`)
        .json<SpaceType>()
      return
      return response
    },
  })
  return (
    <SpaceContext.Provider value={new Space(space!)}>
      {children}
    </SpaceContext.Provider>
  )
}

export function useSpaceContext() {
  return useContext(SpaceContext)
}
