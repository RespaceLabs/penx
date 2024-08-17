enum NetworkNames {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  DEVELOP = 'DEVELOP',
}

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',

  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xb73CA4A87932B6D380BeaE21427D8E34968d96EA',
  SpaceFactory: '0x7f60f598bb368618Fd52Ba664DA02462aA62303f',
}

const sepoliaAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  Space: '0xb73CA4A87932B6D380BeaE21427D8E34968d96EA',
  SpaceFactory: '0x7f60f598bb368618Fd52Ba664DA02462aA62303f',
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
