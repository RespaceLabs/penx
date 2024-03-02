import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('DaoVault', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('TransferETH successfully', async () => {
    const { deployer } = f.accounts

    let ethBalance = await f.daoVault.getBalance()

    expect(ethBalance).to.equal(BigInt(0))

    await deployer.sendTransaction({
      to: f.daoVaultAddress,
      value: precision.token(1, 18),
    })

    ethBalance = await f.daoVault.getBalance()

    expect(ethBalance).to.equal(precision.token(1, 18))

    await f.daoVault.connect(f.deployer).transferETH(f.user1, precision.token(6, 17))

    ethBalance = await f.daoVault.getBalance()

    expect(ethBalance).to.equal(precision.token(4, 17))
  })

  it('TransferETH no permission', async () => {
    const { deployer } = f.accounts

    await deployer.sendTransaction({
      to: f.daoVaultAddress,
      value: precision.token(1, 18),
    })

    const ethBalance = await f.daoVault.getBalance()

    expect(ethBalance).to.equal(precision.token(1, 18))

    await expect(f.daoVault.connect(f.keeper).transferETH(f.user1, precision.token(1))).to.be.revertedWithCustomError(
      f.daoVault,
      'AccessControlUnauthorizedAccount',
    )

    await expect(f.daoVault.connect(f.user0).transferETH(f.user1, precision.token(1))).to.be.revertedWithCustomError(
      f.daoVault,
      'AccessControlUnauthorizedAccount',
    )

    await expect(
      f.daoVault.connect(f.deployer).transferETH(f.user1, precision.token(1)),
    ).to.be.not.revertedWithCustomError(f.daoVault, 'AccessControlUnauthorizedAccount')
  })

  it('TransferERC20Token successfully', async () => {
    const { deployer, user3 } = f.accounts

    let inkOfDaoVault = await f.ink.balanceOf(f.daoVaultAddress)
    let inkOfUser3 = await f.ink.balanceOf(user3)

    expect(inkOfUser3).to.equal(BigInt(0))

    await f.daoVault.connect(f.keeper).transferERC20Token(f.inkAddress, user3, precision.token(100, 18))

    inkOfUser3 = await f.ink.balanceOf(user3)

    const inkOfDaoVaultNow = await f.ink.balanceOf(f.daoVaultAddress)

    expect(inkOfUser3).to.equal(precision.token(100, 18))
    expect(inkOfDaoVaultNow).to.equal(inkOfDaoVault - precision.token(100, 18))
  })

  it('TransferERC20Token no permission', async () => {
    const { deployer, user0, user1 } = f.accounts
    await f.ink.connect(deployer).transfer(f.daoVault, precision.token(100))

    await expect(
      f.daoVault.connect(f.user0).transferERC20Token(f.inkAddress, user0, precision.token(20)),
    ).to.be.revertedWithCustomError(f.daoVault, 'AccessControlUnauthorizedAccount')
  })
})
