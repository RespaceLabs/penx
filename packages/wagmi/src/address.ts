import { NETWORK, NetworkNames } from '@penx/constants'

const developAddress = {
  Believer: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  BelieverFacet: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  DaoVault: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  Diamond: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  DiamondCutFacet: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  DiamondInit: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  DiamondLoupeFacet: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  LibDiamond: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Multicall3: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  PenxPoint: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  PointFacet: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  TaskFacet: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  VaultFacet: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
}

const sepoliaAddress = {}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames?.SEPOLIA) return sepoliaAddress as any
    return developAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
