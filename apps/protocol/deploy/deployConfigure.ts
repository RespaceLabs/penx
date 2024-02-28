import { ethers } from 'hardhat'
import { RoleAccessControlFacet } from '../types'
import { getRoles } from '../config/getRoles'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre) => {
  if (hre.network.name != 'localhost' && hre.network.name != 'hardhat') {
    return
  }

  const rolesConfig = await getRoles(hre)

  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()

  const roleAccessControlFacet = (await ethers.getContractAt(
    'RoleAccessControlFacet',
    diamondAddr,
  )) as unknown as RoleAccessControlFacet

  for (const { account, roles } of rolesConfig) {
    for (const role of roles) {
      if (await roleAccessControlFacet.hasRole(account, ethers.encodeBytes32String(role))) {
        console.log('=======ignore with account role exists', role)
      } else {
        console.log('==========grantRole......')

        await roleAccessControlFacet.grantRole(account, ethers.encodeBytes32String(role))
      }
    }
  }

  console.log('config role end!!!!')
}

func.id = 'Configure'
func.tags = ['Configure']
func.dependencies = ['Tokens', 'DiamondFacets']
export default func
