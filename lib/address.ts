enum NetworkNames {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  DEVELOP = 'DEVELOP',
}

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
  IndieX: '0xE84bB83424A52229288e703C7e55397a9D5a2F3C',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',
}

const sepoliaAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
  IndieX: '0xE84bB83424A52229288e703C7e55397a9D5a2F3C',
  USDC: '0x87174b7C93dB67ab6307951e3A71e70C720D9700',
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
