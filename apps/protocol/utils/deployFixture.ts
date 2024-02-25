import { ethers, deployments } from 'hardhat'
import { precision } from './precision'
import { BountyFacet, DaoVault, Diamond, INK, MockToken } from '../types'

export type Fixture = Awaited<ReturnType<typeof deployFixture>>

export async function deployFixture() {
  await deployments.fixture()
  const accountList = await ethers.getSigners()
  const { deployer, keeper } = await ethers.getNamedSigners()

  const [
    wallet,
    user0,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    signer0,
    signer1,
    signer2,
    signer3,
    signer4,
    signer5,
    signer6,
    signer7,
    signer8,
    signer9,
  ] = accountList
  const usdt = await ethers.getContract<MockToken>('USDT')
  const usdc = await ethers.getContract<MockToken>('USDC')
  const dai = await ethers.getContract<MockToken>('DAI')

  const ink = await ethers.getContract<INK>('INK')

  const diamond = await ethers.getContract<Diamond>('Diamond')
  const diamondAddr = await diamond.getAddress()

  const bountyFacet = (await ethers.getContractAt('BountyFacet', diamondAddr)) as unknown as BountyFacet

  const daoVault = (await ethers.getContractAt('DaoVault', diamondAddr)) as unknown as DaoVault

  // await usdt.mint(user0.address, precision.token(1_000_000, 6))
  // await usdc.mint(user0.address, precision.token(1_000_000, 6))
  // await dai.mint(user0.address, precision.token(1_000_000))

  return {
    getContract: async (name: string) => {
      return await ethers.getContractAt(name, diamondAddr)
    },

    accounts: {
      deployer,
      keeper,

      wallet,
      user0,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      signer0,
      signer1,
      signer2,
      signer3,
      signer4,
      signer5,
      signer6,
      signer7,
      signer8,
      signer9,
      signers: [signer0, signer1, signer2, signer3, signer4, signer5, signer6],
    },

    usdt,
    usdc,
    dai,
    ink,
    daoVault,
    bountyFacet,
  }
}
