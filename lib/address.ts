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

  IndieX: '0xbC550b883f4cE1684E3271Ad5776eF3158E81148',
  Share: '0xF5a030b321aE2773F6BBa147ACbaaB0D1871511B',
  Space: '0xf90Eac26d0753813D3FBb6cCA1A4e0b5d0C45c0e',
  SpaceFactory: '0xE94eBDE43246eF628c0eEABf6f5C3894CBE7B442',
  Staking: '0x404ED7010DdfA6401AEbf9de42172058B73E25ED',
}

const sepoliaAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  IndieX: '0xbC550b883f4cE1684E3271Ad5776eF3158E81148',
  Share: '0xF5a030b321aE2773F6BBa147ACbaaB0D1871511B',
  Space: '0xf90Eac26d0753813D3FBb6cCA1A4e0b5d0C45c0e',
  SpaceFactory: '0xE94eBDE43246eF628c0eEABf6f5C3894CBE7B442',
  Staking: '0x404ED7010DdfA6401AEbf9de42172058B73E25ED',
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
