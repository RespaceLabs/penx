enum NetworkNames {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  DEVELOP = 'DEVELOP',
}

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

const developAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  IndieX: '0x4f34574c630119D572B4Ab0465Bd1Bc4Ed0fD666',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
}

const sepoliaAddress = {
  Multicall3: '0x4F92020650c260Cfa7A935F2333D8a528B2969bA',
  IndieX: '0xeD2DEc0C1C125d8E5Ef6A444D02AcaAA0D2C38eb',
  RemirrorToken: '0x9B53a61Defb84f37aA13567763C47bC2358AFBC9',
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
