import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('INK Test', function () {
  let f: Fixture

  const initialSupply = precision.token(1_000_000_000)

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('Check supply', async () => {
    const supply = await f.ink.totalSupply()
    expect(supply).to.be.equal(initialSupply)
  })

  it('Mint successfully by deployer', async () => {
    const mintAmount = precision.token(100)
    const { deployer, user0, user1 } = f.accounts

    await f.ink.connect(deployer).mint(user1, mintAmount)

    const totalSupply = await f.ink.totalSupply()

    expect(totalSupply).to.be.equal(initialSupply + mintAmount)
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

    let totalSupply = await f.ink.totalSupply()

    expect(totalSupply).to.be.equal(initialSupply)

    await f.ink.connect(f.deployer).burn(f.deployer, burnAmount)

    totalSupply = await f.ink.totalSupply()

    expect(totalSupply).to.be.equal(initialSupply - burnAmount)
  })

  it('Burn failed by not deployer', async () => {
    const burnAmount = precision.token(100)

    await expect(f.ink.connect(f.user0).burn(f.deployer, burnAmount)).to.be.revertedWithCustomError(
      f.ink,
      'OwnableUnauthorizedAccount',
    )
  })
})
