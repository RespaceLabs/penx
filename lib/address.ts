import { NETWORK, NetworkNames } from './constants'

const developAddress = {
  SpaceFactory: '0xBB49C3C9a9d34FcaDC6Bcc7EffFC1d6592e8473a',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
  Tip: '0xdE818534275A664b40B00884f2595f0249c3DC69',
}

const arbSepoliaAddress = {
  SpaceFactory: '0x7338e3E4CeD6916686cf4E82c515ECD9D244C934',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
  Tip: '0xdE818534275A664b40B00884f2595f0249c3DC69',
}

const baseSepoliaAddress = {
  SpaceFactory: '0x6A96100F5e5231c3e838e1150eEF9255062895Ee',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
  Tip: '0xdE818534275A664b40B00884f2595f0249c3DC69',
}
const baseAddress = {
  SpaceFactory: '0x692C2493Dd672eA3D8515C193e4c6E0788972115',
  TreeToken: '0x3b124F95542B8bD7B8E0F54367E4F69702FAcBC6',
  Tip: '0xdE818534275A664b40B00884f2595f0249c3DC69',
}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.ARB_SEPOLIA) {
      return arbSepoliaAddress
    }
    if (NETWORK === NetworkNames.BASE_SEPOLIA) {
      return baseSepoliaAddress
    }
    if (NETWORK === NetworkNames.BASE) {
      return baseAddress
    }
    return baseAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
