import { ethers } from 'hardhat'
import { getSelectors, FacetCutAction, getAllAlreadySelectors, getSelectorsExcludeAlready } from '../utils/diamond'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const facetDependencies = [
  'Diamond',
  'DiamondCutFacet',
  'DiamondLoupeFacet',
  'BelieverFacet',
  'PointFacet',
  'TaskFacet',
  'VaultFacet',
]

const func = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name != 'localhost' && hre.network.name != 'hardhat') {
    return
  }
  const diamond = await ethers.getContract('Diamond')
  const diamondAddr = await diamond.getAddress()
  console.log('diamondAddr', diamondAddr)

  const alreadySelectors = await getAllAlreadySelectors(diamondAddr)
  let facets = []
  let total = 0
  const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddr)
  for (var i = 3; i < facetDependencies.length; i++) {
    const contract = await ethers.getContract(facetDependencies[i])
    const functionSelectors = getSelectorsExcludeAlready(contract, alreadySelectors)
    if (functionSelectors.length == 0) {
      continue
    }
    facets.push({
      facetAddress: await contract.getAddress(),
      action: FacetCutAction.Add,
      functionSelectors: functionSelectors,
    })
    total += functionSelectors.length
    if (total > 30 || (total > 0 && i == facetDependencies.length - 1)) {
      const tx = await diamondCutFacet.diamondCut(facets, ethers.ZeroAddress, '0x', { gasLimit: 20000000 })
      const receipt = await tx.wait()
      if (!receipt.status) {
        throw Error(`Diamond init failed: ${tx.hash}`)
      }
      total = 0
      facets = []
    }
  }
}

func.tags = ['DiamondFacets']
func.dependencies = facetDependencies
export default func
