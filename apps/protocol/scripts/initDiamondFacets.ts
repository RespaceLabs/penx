import { ethers } from 'hardhat'
import { getSelectors, FacetCutAction, getAllAlreadySelectors, getSelectorsExcludeAlready } from '../utils/diamond'

const facetDependencies = ['PointFacet', 'BelieverFacet', 'BountyFacet', 'VaultFacet', 'RoleAccessControlFacet']

async function main() {
  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()
  console.log('diamondAddr', diamondAddr)

  const alreadySelectors = await getAllAlreadySelectors(diamondAddr)
  let facets = []
  let total = 0
  const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddr)
  for (var i = 0; i < facetDependencies.length; i++) {
    const contract = await ethers.getContract(facetDependencies[i])
    const functionSelectors = getSelectorsExcludeAlready(contract, alreadySelectors)
    if (functionSelectors.length == 0) {
      console.log('ignore contract with functionSelectors.length == 0', await contract.getAddress())
      continue
    }
    facets.push({
      facetAddress: await contract.getAddress(),
      action: FacetCutAction.Add,
      functionSelectors: functionSelectors,
    })
    total += functionSelectors.length
    if (total > 100 || (total > 0 && i == facetDependencies.length - 1)) {
      console.log('add facets', facets)
      const tx = await diamondCutFacet.diamondCut(facets, ethers.ZeroAddress, '0x', { gasLimit: 8000000 })
      const receipt = await tx.wait()
      if (!receipt.status) {
        throw Error(`Diamond init failed: ${tx.hash}`)
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
