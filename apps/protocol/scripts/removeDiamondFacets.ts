import { ethers } from 'hardhat'
import {
  getSelectors,
  FacetCutAction,
  getAllAlreadySelectors,
  getSelectorsExcludeAlready,
  getSelectorsIncludeAlready,
} from '../utils/diamond'
import { ZeroAddress } from 'ethers'

const removeFacets = ['PointFacet', 'BelieverFacet', 'BountyFacet', 'VaultFacet', 'RoleAccessControlFacet']

async function main() {
  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()

  const alreadySelectors = await getAllAlreadySelectors(diamondAddr)
  let facets = []
  let total = 0
  const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddr)
  for (var i = 0; i < removeFacets.length; i++) {
    const contract = await ethers.getContract(removeFacets[i])
    const functionSelectors = getSelectorsIncludeAlready(contract, alreadySelectors)
    if (functionSelectors.length == 0) {
      console.log('ignore contract with functionSelectors.length == 0', await contract.getAddress())
      continue
    }
    facets.push({
      facetAddress: ZeroAddress,
      action: FacetCutAction.Remove,
      functionSelectors: functionSelectors,
    })
    total += functionSelectors.length
    if (total > 100 || (total > 0 && i == removeFacets.length - 1)) {
      console.log('delete facets', facets)
      const tx = await diamondCutFacet.diamondCut(facets, ethers.ZeroAddress, '0x', { gasLimit: 5000000 })
      const receipt = await tx.wait()
      if (!receipt.status) {
        throw Error(`Remove facets failed: ${tx.hash}`)
      }
      total = 0
      facets = []
    }
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((ex) => {
    console.error(ex)
    process.exit(1)
  })
