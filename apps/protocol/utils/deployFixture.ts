import { ethers, deployments } from 'hardhat'
import { precision } from './precision'
import {
  BelieverFacet,
  BountyFacet,
  DaoVault,
  Diamond,
  INK,
  MockToken,
  PasswordManager,
  RoleAccessControlFacet,
} from '../types'

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

  const [usdt, usdc, dai, ink, daoVault, passwordManager] = await Promise.all([
    ethers.getContract<MockToken>('USDT'),
    ethers.getContract<MockToken>('USDC'),
    ethers.getContract<MockToken>('DAI'),
    ethers.getContract<INK>('INK'),
    ethers.getContract<DaoVault>('DaoVault'),
    ethers.getContract<PasswordManager>('PasswordManager'),
  ])

  const diamond = await ethers.getContract<Diamond>('Diamond')
  const diamondAddress = await diamond.getAddress()

  const [inkAddress, daoVaultAddress, bountyFacet, roleAccessControlFacet, believerFacet] = await Promise.all([
    ink.getAddress(),
    daoVault.getAddress(),
    ethers.getContractAt('BountyFacet', diamondAddress) as unknown as Promise<BountyFacet>,
    ethers.getContractAt('RoleAccessControlFacet', diamondAddress) as unknown as Promise<RoleAccessControlFacet>,
    ethers.getContractAt('BelieverFacet', diamondAddress) as unknown as Promise<BelieverFacet>,
  ])

  // mint token to daoVault
  await usdt.mint(daoVaultAddress, precision.token(1_000_000, 6))
  await dai.mint(daoVaultAddress, precision.token(1_000_000, 18))
  await usdc.mint(daoVaultAddress, precision.token(1_000_000, 6))
  await ink.mint(daoVaultAddress, precision.token(1_000_000, 18))

  const accounts = {
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
  }

  return {
    getContract: async (name: string) => {
      return await ethers.getContractAt(name, diamondAddress)
    },

    accounts,
    ...accounts,

    usdt,
    usdc,
    dai,
    ink,

    daoVault,
    passwordManager,

    bountyFacet,
    roleAccessControlFacet,
    believerFacet,

    // address
    inkAddress,
    daoVaultAddress,
    diamondAddress,
  }
}
