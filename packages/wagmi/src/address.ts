import { NETWORK, NetworkNames } from '@penx/constants'

const developAddress = {
  Believer: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  BelieverFacet: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  BountyFacet: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
  DAI: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
  DaoVault: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  Diamond: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  DiamondCutFacet: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  DiamondInit: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  DiamondLoupeFacet: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  INK: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  LibDiamond: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  Multicall3: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
  PointFacet: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  TransferUtils: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  USDC: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
  USDT: '0x9A676e781A523b5d0C0e43731313A708CB607508',
  VaultFacet: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
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
