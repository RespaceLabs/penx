import { expect, assert } from 'chai'
import { precision } from '@utils/precision'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { Fixture, deployFixture } from '@utils/deployFixture'

describe('believerFacet', function () {
  let f: Fixture

  beforeEach(async () => {
    f = await deployFixture()
  })

  it.only('min believer NFT', async () => {
    const { deployer } = f.accounts

    const { maxSupply, currentSupply, currentPrice, minPrice, maxPrice } = await f.believerFacet.getTokenInfo()
    console.log('believer Facet 2:', {
      maxSupply: Number(maxSupply),
      currentSupply: Number(currentSupply),
      currentPrice: precision.toTokenDecimal(currentPrice),
      minPrice: precision.toTokenDecimal(minPrice),
      maxPrice: precision.toTokenDecimal(maxPrice),
    })

    await f.believerFacet.connect(f.user2).mintBelieverNFT({
      value: precision.token(1, 18),
    })

    await f.believerFacet.connect(f.user2).mintBelieverNFT({
      value: precision.token(1, 18),
    })

    const {
      maxSupply: maxSupplyAfer,
      currentSupply: currentSupplyAfter,
      currentPrice: currentPriceAfter,
      minPrice: minPriceAfter,
      maxPrice: maxPriceAfter,
    } = await f.believerFacet.getTokenInfo()
    console.log('believer Facet 2:', {
      maxSupply: Number(maxSupplyAfer),
      currentSupply: Number(currentSupplyAfter),
      currentPrice: precision.toTokenDecimal(currentPriceAfter),
      minPrice: precision.toTokenDecimal(minPriceAfter),
      maxPrice: precision.toTokenDecimal(maxPriceAfter),
    })
  })
})
