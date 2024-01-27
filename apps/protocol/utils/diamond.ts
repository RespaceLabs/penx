import { BaseContract } from 'ethers'
import { ethers } from 'hardhat'

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }

export function getSelectors(contract: BaseContract) {
  const selectors: String[] = []
  contract.interface.forEachFunction((interfaceFunction) => {
    if ('constructor' != interfaceFunction.name && 'supportsInterface(bytes4)' != interfaceFunction.name) {
      selectors.push(interfaceFunction.selector)
      console.log('add interfaceFunction.name', interfaceFunction.name, interfaceFunction.selector)
    }
  })
  return selectors
}

export function getSelectorsExcludeAlready(contract: BaseContract, alreadySelectors: String[]) {
  const selectors: String[] = []
  contract.interface.forEachFunction((interfaceFunction) => {
    if (
      'constructor' != interfaceFunction.name &&
      'supportsInterface(bytes4)' != interfaceFunction.name &&
      !alreadySelectors.includes(interfaceFunction.selector)
    ) {
      selectors.push(interfaceFunction.selector)
      console.log('add interfaceFunction.name', interfaceFunction.name, interfaceFunction.selector)
    }
  })
  return selectors
}

export function getSelectorsIncludeAlready(contract: BaseContract, alreadySelectors: String[]) {
  const selectors: String[] = []
  contract.interface.forEachFunction((interfaceFunction) => {
    if (alreadySelectors.includes(interfaceFunction.selector)) {
      selectors.push(interfaceFunction.selector)
      console.log('delete interfaceFunction.name', interfaceFunction.name, interfaceFunction.selector)
    }
  })
  return selectors
}

export async function getAllAlreadySelectors(diamondAddr: string) {
  let selectors: String[] = []
  const diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddr)
  const alreadyFacets = await diamondLoupeFacet.facets()

  console.log('alreadyFacets', alreadyFacets)

  for (var i = 0; i < alreadyFacets.length; i++) {
    selectors = selectors.concat(alreadyFacets[i].functionSelectors)
  }
  return selectors
}

exports.getSelectors = getSelectors
exports.getAllAlreadySelectors = getAllAlreadySelectors
exports.FacetCutAction = FacetCutAction
