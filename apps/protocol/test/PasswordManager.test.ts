import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import {} from 'ethers'
import { Fixture, deployFixture } from '@utils/deployFixture'
import { BountyFacet, Bounty } from 'types'
import { encryptString } from '@utils/encryptString'
import { decryptString } from '@utils/decryptString'

describe('PasswordManager', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('password get and set', async () => {
    let password = await f.passwordManager.connect(f.deployer).getPassword()
    expect(password).to.be.equal('')

    await f.passwordManager.connect(f.deployer).setPassword('123456')
    password = await f.passwordManager.connect(f.deployer).getPassword()

    expect(password).to.be.equal('123456')
  })

  it.only('password signing', async () => {
    const rawPassword = '123456'
    const message = f.deployer.address
    const signature = await f.deployer.signMessage(message)
    // const recoveredAddress = ethers.verifyMessage(message, signature)
    const hashed = encryptString(rawPassword, signature)

    await f.passwordManager.connect(f.deployer).setPassword(hashed)

    let password = await f.passwordManager.connect(f.deployer).getPassword()

    const decodedPassword = decryptString(password, signature)

    expect(rawPassword).to.be.equal(decodedPassword)
  })
})
