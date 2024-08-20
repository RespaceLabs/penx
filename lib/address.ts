enum NetworkNames {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  DEVELOP = 'DEVELOP',
}

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xE6C12767065Bfde909f9c6A5B6752b0402DB808B',
  SpaceFactory: '0x45aBaADf86484aF8d08037017050a81669c2f3AB',
}

const sepoliaAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xE6C12767065Bfde909f9c6A5B6752b0402DB808B',
  SpaceFactory: '0x45aBaADf86484aF8d08037017050a81669c2f3AB',
}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.SEPOLIA) {
      return sepoliaAddress
    }
    return developAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
