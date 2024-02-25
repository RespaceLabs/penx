import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('INK Test', function () {
  let f: Fixture

  const initialSupply = precision.token(10_000_000_000)

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('Check supply', async () => {
    const supply = await f.ink.totalSupply()
    expect(supply).to.be.equal(initialSupply)
  })

  it.only('Mint successfully by deployer', async () => {
    const mintAmount = precision.token(100)
    const { deployer, user0, user1 } = f.accounts

    await f.ink.connect(deployer).mint(user1, mintAmount)

    const supply = await f.ink.totalSupply()

    expect(supply).to.be.equal(initialSupply + mintAmount)
  })

  it.only('Mint failed by not deployer', async () => {
    const mintAmount = precision.token(100)
    const { user0, user1 } = f.accounts
    // TODO:
  })
})
