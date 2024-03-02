import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('INK Test', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('Mint successfully by deployer', async () => {
    const mintAmount = precision.token(100)
    const { deployer, user0, user1 } = f.accounts

    const totalSupplyPrev = await f.ink.totalSupply()

    await f.ink.connect(deployer).mint(user1, mintAmount)

    const totalSupplyNext = await f.ink.totalSupply()

    expect(totalSupplyNext).to.be.equal(totalSupplyPrev + mintAmount)
  })

  it('Mint failed by not deployer', async () => {
    const mintAmount = precision.token(100)

    await expect(f.ink.connect(f.user0).mint(f.deployer, mintAmount)).to.be.revertedWithCustomError(
      f.ink,
      'OwnableUnauthorizedAccount',
    )
  })

  it('Mint failed when Exceeding max supply', async () => {
    const mintAmount = precision.token(10_000_000_000)

    await expect(f.ink.connect(f.deployer).mint(f.user1, mintAmount)).to.be.revertedWith('Exceeds max supply')
  })

  it('Burn successfully', async () => {
    const burnAmount = precision.token(100)

    const totalSupplyPrev = await f.ink.totalSupply()

    await f.ink.connect(f.deployer).burn(f.deployer, burnAmount)

    const totalSupplyNext = await f.ink.totalSupply()

    expect(totalSupplyPrev).to.be.equal(totalSupplyNext + burnAmount)
  })

  it('Burn failed by not deployer', async () => {
    const burnAmount = precision.token(100)

    await expect(f.ink.connect(f.user0).burn(f.deployer, burnAmount)).to.be.revertedWithCustomError(
      f.ink,
      'OwnableUnauthorizedAccount',
    )
  })
})
