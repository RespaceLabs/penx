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

  BlankFarmer: '0x349BBA46B1CbA77EfAdb3d55EE6bFe82612C1e00',
  IndieX: '0x3a2eC87Ad66abFD9ca411d2A69D3356CD09c72bd',
  Space: '0xe20Fc4DA473e1DC56179cC48C4dE847AbFdb21DC',
  SpaceFactory: '0x8552A770AC8bc2452808BeE9fA2DC3a89C1a6fEE',
  StakingRewards: '0xCD7Ff895eae1b40477b34053075648c5DA55EC9F',
  Token: '0x9e97a7fE67697020758af21A86D45fF883B94E15',
}

const sepoliaAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',

  BlankFarmer: '0x349BBA46B1CbA77EfAdb3d55EE6bFe82612C1e00',
  IndieX: '0x3a2eC87Ad66abFD9ca411d2A69D3356CD09c72bd',
  Space: '0xe20Fc4DA473e1DC56179cC48C4dE847AbFdb21DC',
  SpaceFactory: '0x8552A770AC8bc2452808BeE9fA2DC3a89C1a6fEE',
  StakingRewards: '0xCD7Ff895eae1b40477b34053075648c5DA55EC9F',
  Token: '0x9e97a7fE67697020758af21A86D45fF883B94E15',
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
