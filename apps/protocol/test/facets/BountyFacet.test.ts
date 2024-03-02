import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { Fixture, deployFixture } from '@utils/deployFixture'
import { BountyFacet, Bounty } from 'types'

describe('BountyFacet', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it('Claim bounty successfully', async () => {
    const bountyId = '1-2-3'

    const usdtAmount = precision.token(100, 6)
    const inkAmount = precision.token(50, 18)
    const rewards: BountyFacet.RewardParamStruct[] = [
      { token: f.usdt, amount: usdtAmount },
      { token: f.ink, amount: inkAmount },
    ]

    await f.bountyFacet.setNextUuid()
    const requestId = await f.bountyFacet.getLastUuid()

    await f.bountyFacet.connect(f.user2).createClaimBountyRequest(bountyId)

    const inkOfDaoVaultPrev = await f.ink.balanceOf(f.daoVaultAddress)
    const inkOfUser2Prev = await f.ink.balanceOf(f.user2)
    const usdtOfUser2Prev = await f.usdt.balanceOf(f.user2)

    await f.bountyFacet.connect(f.keeper).executeClaimReward(requestId + BigInt(1), rewards)

    const inkOfDaoVaultNext = await f.ink.balanceOf(f.daoVaultAddress)
    const inkOfUser2Next = await f.ink.balanceOf(f.user2)
    const usdtOfUser2Next = await f.usdt.balanceOf(f.user2)

    expect(inkOfDaoVaultPrev).to.be.equal(inkOfDaoVaultNext + inkAmount)
    expect(inkOfUser2Prev).to.be.equal(inkOfUser2Next - inkAmount)
    expect(usdtOfUser2Prev).to.be.equal(usdtOfUser2Next - usdtAmount)
  })

  it('Claim bounty failed because of no permission', async () => {
    const requestId = await f.bountyFacet.getLastUuid()
    const rewards: BountyFacet.RewardParamStruct[] = [
      {
        token: f.usdc,
        amount: precision.token(100, 6),
      },
      {
        token: f.ink,
        amount: precision.token(50, 6),
      },
    ]

    await expect(f.bountyFacet.connect(f.user2).executeClaimReward(requestId, rewards)).to.be.revertedWithCustomError(
      f.bountyFacet,
      'InvalidRoleAccess',
    )
  })
})
