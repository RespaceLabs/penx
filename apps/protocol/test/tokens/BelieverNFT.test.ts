import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('believerFacet', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('Register referral code failed with invalid length', async () => {
    await expect(f.believerNFT.connect(f.user0).setReferralCode('ABC')).to.be.revertedWith(
      'Code length should greater then 3',
    )
  })

  it('Register referral code successfully', async () => {
    const code = 'ABCD'
    await f.believerNFT.connect(f.user0).setReferralCode(code)

    const codeOnchain = await f.believerNFT.getReferralCode(f.user0)
    expect(codeOnchain).to.equal(code)

    const referrer = await f.believerNFT.getReferrer(code)
    expect(referrer).to.equal(f.user0.address)

    const referrals = await f.believerNFT.getReferrals(f.user0)

    expect(referrals.length).to.equal(0)
  })

  it('Register referral code failed because of existing', async () => {
    const code = 'ABCD'
    await f.believerNFT.connect(f.user0).setReferralCode(code)

    await expect(f.believerNFT.connect(f.user0).setReferralCode(code)).to.be.revertedWithCustomError(
      f.believerNFT,
      'ReferralCodeExisted',
    )

    await expect(f.believerNFT.connect(f.user1).setReferralCode(code)).to.be.revertedWithCustomError(
      f.believerNFT,
      'ReferralCodeExisted',
    )
  })

  it('Mint believer NFT with empty code', async () => {
    const baseURI = 'https://www.penx.io/api/believer-nft/'
    const { user2 } = f.accounts

    const { currentSupply, currentPrice } = await f.believerNFT.getTokenInfo()

    const vaultEthPrev = await f.daoVault.getBalance()
    const user2EthPrev = await ethers.provider.getBalance(user2)

    const code = '' // Empty code

    await f.believerNFT.connect(user2).mintNFT(code, {
      value: currentPrice,
    })

    const tokenURIOnChain = await f.believerNFT.tokenURI(1)

    expect(tokenURIOnChain).to.equal(baseURI + '1')

    const vaultEthNext = await f.daoVault.getBalance()
    const user2EthNext = await ethers.provider.getBalance(user2)

    expect(vaultEthNext).to.be.equal(vaultEthPrev + currentPrice)
    expect(user2EthNext).to.be.lessThan(user2EthPrev - currentPrice)

    const tokenInfo = await f.believerNFT.getTokenInfo()

    expect(tokenInfo.currentSupply).to.be.equal(currentSupply + 1n)
  })

  it('Mint believer NFT with valid referral code', async () => {
    const { deployer, user1, user2 } = f.accounts

    const { currentSupply, currentPrice } = await f.believerNFT.getTokenInfo()

    const code = '123ABC' // Empty code

    await f.believerNFT.connect(user1).setReferralCode(code)

    const codeOnchain = await f.believerNFT.getReferralCode(user1)

    expect(code).to.be.equal(codeOnchain)

    const vaultEthPrev = await f.daoVault.getBalance()
    const user1EthPrev = await ethers.provider.getBalance(user1)
    const user2EthPrev = await ethers.provider.getBalance(user2)

    await f.believerNFT.connect(user2).mintNFT(code, {
      value: currentPrice,
    })

    const vaultEthNext = await f.daoVault.getBalance()
    const user1EthNext = await ethers.provider.getBalance(user1)
    const user2EthNext = await ethers.provider.getBalance(user2)

    const withPercent = (v: bigint, percent: bigint) => (v * percent) / BigInt(100)

    expect(vaultEthNext).to.be.equal(vaultEthPrev + withPercent(currentPrice, 80n))

    expect(user1EthNext).to.be.equal(user1EthPrev + withPercent(currentPrice, 10n))

    expect(user2EthNext).to.be.lessThan(user2EthPrev - withPercent(currentPrice, 90n))
    expect(user2EthNext).to.be.greaterThan(user2EthPrev - withPercent(currentPrice, 100n))

    const tokenInfo = await f.believerNFT.getTokenInfo()

    expect(tokenInfo.currentSupply).to.be.equal(currentSupply + 1n)
  })

  it('Mint two believer NFTs consecutively', async () => {
    const { user2 } = f.accounts
    const code = '' // Empty code

    const info1 = await f.believerNFT.getTokenInfo()

    await f.believerNFT.connect(user2).mintNFT(code, {
      value: info1.currentPrice,
    })

    await expect(
      f.believerNFT.connect(user2).mintNFT(code, {
        value: info1.currentPrice,
      }),
    ).to.be.revertedWith('Insufficient payment')

    const info2 = await f.believerNFT.getTokenInfo()

    expect(info2.currentSupply).to.be.equal(info1.currentSupply + 1n)

    await f.believerNFT.connect(user2).mintNFT(code, {
      value: info2.currentPrice,
    })

    const info3 = await f.believerNFT.getTokenInfo()

    expect(info3.currentSupply).to.be.equal(info1.currentSupply + 2n)
  })
})
