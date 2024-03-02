import { ethers } from 'hardhat'
import { DaoVault, INK, MockToken, RoleAccessControlFacet } from '../types'
import { getRoles } from '../config/getRoles'
import { DeployFunction } from 'hardhat-deploy/types'
import { precision } from '@utils/precision'

const func: DeployFunction = async (hre) => {
  const rolesConfig = await getRoles(hre)
  const { deployer, keeper } = await hre.getNamedAccounts()
  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()

  const roleAccessControlFacet = (await ethers.getContractAt(
    'RoleAccessControlFacet',
    diamondAddr,
  )) as unknown as RoleAccessControlFacet

  const [usdt, usdc, dai, ink, daoVault] = await Promise.all([
    ethers.getContract<MockToken>('USDT'),
    ethers.getContract<MockToken>('USDC'),
    ethers.getContract<MockToken>('DAI'),
    ethers.getContract<INK>('INK'),
    ethers.getContract('DaoVault') as Promise<DaoVault>,
  ])

  /** Config diamond roles */
  for (const { account, roles } of rolesConfig) {
    for (const role of roles) {
      const isHasRole = await roleAccessControlFacet.hasRole(account, ethers.encodeBytes32String(role))

      // isHasRole && console.log('=======ignore with account role exists', role)
      if (!isHasRole) {
        // console.log('==========grantRole......')
        await roleAccessControlFacet.grantRole(account, ethers.encodeBytes32String(role))
      }
    }
  }

  console.log('config role end!!!!')

  /** Config DaoVault role */
  await daoVault.grantRole(ethers.encodeBytes32String('KEEPER_ROLE'), diamondAddr)
  await daoVault.grantRole(ethers.encodeBytes32String('KEEPER_ROLE'), deployer)
  await daoVault.grantRole(ethers.encodeBytes32String('KEEPER_ROLE'), keeper)

  // mint token to daoVault
  const daoVaultAddress = await daoVault.getAddress()
  console.log('==========daoVaultAddress:', daoVaultAddress)

  await usdt.mint(daoVaultAddress, precision.token(1_000_000, 6))
  await dai.mint(daoVaultAddress, precision.token(1_000_000, 18))
  await usdc.mint(daoVaultAddress, precision.token(1_000_000, 6))
  await ink.mint(daoVaultAddress, precision.token(1_000_000, 18))
}

func.id = 'Configure'
func.tags = ['Configure']
func.dependencies = ['Tokens', 'DiamondFacets']
export default func
