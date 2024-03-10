import { NETWORK, NetworkNames } from '@penx/constants'

const developAddress = {
  BelieverNFT: '0x9E545E3C0baAB3E08CdfD552C960A1050f373042',
  Bounty: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
  BountyFacet: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
  CalUtils: '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9',
  DAI: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  DaoVault: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
  Diamond: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
  DiamondCutFacet: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  DiamondInit: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  DiamondLoupeFacet: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  INK: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
  LibDiamond: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
  Multicall3: '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB',
  PasswordManager: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  PointFacet: '0x9A676e781A523b5d0C0e43731313A708CB607508',
  RoleAccessControl: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
  RoleAccessControlFacet: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  USDC: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  USDT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  UuidCreator: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
  VaultFacet: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
}

const sepoliaAddress = {}

export const addressMap: Record<keyof typeof developAddress, any> =
  (function () {
    if (NETWORK === NetworkNames.SEPOLIA) return sepoliaAddress as any
    return developAddress
  })()

export const ADDRESS_TO_CONTRACT = new Map(
  Object.entries(addressMap).map(([contract, address]) => [address, contract]),
)
