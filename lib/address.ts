import { NETWORK, NetworkNames } from './constants'

const baseSepoliaAddress = {
  SpaceFactory: '0x6A96100F5e5231c3e838e1150eEF9255062895Ee',
  CreationFactory: '0xB2ebC5f85E0DA834CB71884150d2Fd738fEf918B',
  PenToken: '0xd8501D1063Db721512572738e53775F11C05Df10',
  Tip: '0xe31E51b20C1a054Fa46Dacd31C8a45ce3C97C834',
}

const baseAddress = {
  SpaceFactory: '0x692C2493Dd672eA3D8515C193e4c6E0788972115',
  CreationFactory: '0xB9563EBeDE644956FB4d8EFE40440bAeA8da342D',
  PenToken: '0xadA2eA2D7e2AbB724F860ED8d08F85B25a4cB90d',
  Tip: '0xD1B9751cdb3A6599f47eb3581446750c949c5f51',
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
