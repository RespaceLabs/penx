import _ from 'lodash'
import hre, { ethers } from 'hardhat'
import { ZeroAddress } from 'ethers'
import { RoleAccessControlFacet } from '../types'
import { getRoles } from '../config/getRoles'

export const ROLE_CONFIG = 'CONFIG'

const removeRoles = {
  sepolia: [
    {
      account: ZeroAddress,
      role: ROLE_CONFIG,
    },
  ],
}

async function main() {
  const roles = await getRoles(hre)

  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()
  const roleAccessControlFacet = (await ethers.getContractAt(
    'RoleAccessControlFacet',
    diamondAddr,
  )) as unknown as RoleAccessControlFacet

  console.log('add account role start')
  for (var i = 0; i < roles.length; i++) {
    console.log(i, '-', roles[i].account)
    for (var j = 0; j < roles[i].roles.length; j++) {
      if (await roleAccessControlFacet.hasRole(roles[i].account, ethers.encodeBytes32String(roles[i].roles[j]))) {
        console.log('ignore with account role exists', roles[i].roles[j])
      } else {
        await roleAccessControlFacet.grantRole(roles[i].account, ethers.encodeBytes32String(roles[i].roles[j]))
        console.log('add account role', roles[i].roles[j])
      }
    }
  }
  console.log('add account role end')

  console.log('remove account role start')

  console.log('hre.network.name', hre.network.name)
  const removeRole = removeRoles['sepolia']

  for (let i = 0; i < removeRole.length; i++) {
    const { account, role } = removeRole[i]
    if (await roleAccessControlFacet.hasRole(account, ethers.encodeBytes32String(role))) {
      await roleAccessControlFacet.revokeRole(account, ethers.encodeBytes32String(role))
      console.log('remove account role success', role)
    } else {
      console.log('ignore remove role with not exists', role)
    }
  }
  console.log('remove account role end')
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((ex) => {
    console.error(ex)
    process.exit(1)
  })
