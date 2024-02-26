import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('DaoVault', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('TransferToken', async () => {
    const { deployer, user0, user1 } = f.accounts
    await f.ink.connect(deployer).transfer(f.daoVault, precision.token(100))

    let balanceOfDaoVault = await f.ink.balanceOf(f.daoVaultAddress)
    console.log('===========balanceOfDaoVault:', precision.toTokenDecimal(balanceOfDaoVault))

    let balanceOfUser0 = await f.ink.balanceOf(user0)
    console.log('===========balanceOfUser0:', precision.toTokenDecimal(balanceOfUser0))

    // const roles = await f.roleAccessControlFacet.hasRole(deployer, ethers.encodeBytes32String('KEEPER'))
    // console.log('========role from faucet:', roles, 'deployer:', await deployer.getAddress())

    await f.daoVault.connect(deployer).transferOut(f.inkAddress, user0, precision.token(20))

    balanceOfDaoVault = await f.ink.balanceOf(f.daoVaultAddress)
    console.log('===========balanceOfDaoVault:', precision.toTokenDecimal(balanceOfDaoVault))

    balanceOfUser0 = await f.ink.balanceOf(user0)
    console.log('===========balanceOfUser0:', precision.toTokenDecimal(balanceOfUser0))
  })

  it('TransferToken no permission', async () => {
    const { deployer, user0, user1 } = f.accounts
    await f.ink.connect(deployer).transfer(f.daoVault, precision.token(100))

    await expect(
      f.daoVault.connect(user0).transferOut(f.inkAddress, user0, precision.token(20)),
    ).to.be.revertedWithCustomError(f.daoVault, 'OwnableUnauthorizedAccount')
  })
})
