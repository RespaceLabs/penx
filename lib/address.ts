import { NetworkNames } from './constants'

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  SpaceFactory: '0xBB49C3C9a9d34FcaDC6Bcc7EffFC1d6592e8473a',
}

const arbSepoliaAddress = {
  SpaceFactory: '0x7338e3E4CeD6916686cf4E82c515ECD9D244C934',
}

const baseSepoliaAddress = {
  SpaceFactory: '0x6A96100F5e5231c3e838e1150eEF9255062895Ee',
}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.ARB_SEPOLIA) {
      return arbSepoliaAddress
    }
    if (NETWORK === NetworkNames.BASE_SEPOLIA) {
      return baseSepoliaAddress
    }
    return developAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
