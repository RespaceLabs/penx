import { NETWORK, NetworkNames } from './constants'

const baseSepoliaAddress = {
  SpaceFactory: '0x6A96100F5e5231c3e838e1150eEF9255062895Ee',
  CreationFactory: '0x2037A850dFFd3850297608244d2f07668fDAb018',
  TreeToken: '0xEF4C961dA2C72B883E4755DA5c4b3b773227B734',
  Tip: '0x0708eA842bd28c8C1eAD1Ca3c1a62e83EE433cd7',
}

const baseAddress = {
  SpaceFactory: '0x692C2493Dd672eA3D8515C193e4c6E0788972115',
  CreationFactory: '0x20D1a8a3D824fb6173cDa35a67e26217B6745ebf',
  TreeToken: '0xEF4C961dA2C72B883E4755DA5c4b3b773227B734',
  Tip: '0xe6fe2b08d8b547C5Ea4293252ee2F82a22c358D1',
}

export const addressMap: Record<keyof typeof baseSepoliaAddress, any> =
  (function () {
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
