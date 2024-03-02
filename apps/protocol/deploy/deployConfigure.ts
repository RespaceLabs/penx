import { ethers } from 'hardhat'
import { DaoVault, RoleAccessControlFacet } from '../types'
import { getRoles } from '../config/getRoles'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre) => {
  const rolesConfig = await getRoles(hre)
  const { deployer, keeper } = await hre.getNamedAccounts()
  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()

  const roleAccessControlFacet = (await ethers.getContractAt(
    'RoleAccessControlFacet',
    diamondAddr,
  )) as unknown as RoleAccessControlFacet

  const daoVault = (await ethers.getContract('DaoVault')) as unknown as DaoVault

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
}

func.id = 'Configure'
func.tags = ['Configure']
func.dependencies = ['Tokens', 'DiamondFacets']
export default func
