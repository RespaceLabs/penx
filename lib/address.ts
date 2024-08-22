import { NetworkNames } from './constants'

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xE6C12767065Bfde909f9c6A5B6752b0402DB808B',
  SpaceFactory: '0x45aBaADf86484aF8d08037017050a81669c2f3AB',
}

const arbSepoliaAddress = {
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xE6C12767065Bfde909f9c6A5B6752b0402DB808B',
  SpaceFactory: '0x45aBaADf86484aF8d08037017050a81669c2f3AB',
}

const baseSepoliaAddress = {
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xd971865bEa26536FA6cCeED6dDc8dF524ac2Eb03',
  SpaceFactory: '0xCAF816A9eE53fD27281A5b45A77a801d40c53103',
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
